const { Given, When, Then } = require('cucumber');
const { After, AfterAll, BeforeAll, setDefaultTimeout } = require('cucumber');
const { QtAuto } = require('leanpro.qt');
const { Util } = require('leanpro.common');
const { CukeTest } = require('cuketest');
const path = require("path");
const assert = require('assert');
let model = QtAuto.loadModel(__dirname + "/model.tmodel");

/// Timeout and Hook settings ///
setDefaultTimeout(60 * 1000);  //set step timeout to be 60 seconds
let child;

BeforeAll(async function () {
    CukeTest.minimize();
    
    let sampleDir = path.dirname(process.execPath) // CukeTest default sample path
    child = await QtAuto.launchQtProcessAsync([  // Multiple startup paths are passed in for different systems, and the available paths will be automatically selected
        sampleDir + "/bin/dirview",
        sampleDir + "\\bin\\dirview.exe"
    ]); 
    await model.getApplication("dirview").exists(10);
})

After(async function () {
    let screenshot = await model.getTree("Dir_View").takeScreenshot();
    this.attach(screenshot, 'image/png');
    await Util.delay(2000);
})

AfterAll(async function () {
    CukeTest.restore();
    CukeTest.maximize();
    Util.stopProcess(child)
})

//// your step definition /////

Given("Expand to the tree node where the {string} file is located", async function (relativePath) {

    // Split a path into an array of path nodes
    let dirNamePath = path.resolve(__dirname, '..', relativePath).split(path.sep);
    this.attach(`pathNodes: [${dirNamePath}]`);
    let tree = model.getTree('Dir_View');
    let targetItem;

    // Because the path root node requires special handling
    // In Windows system, it is disk name + disk letter
    // `/` in Linux system, empty character '' in pathNodes
    let root = dirNamePath[0];
    if (root === '') {
        targetItem = await tree.findItem('/');
    } else {
        let rootNodeList = await tree.children();
        await Promise.all(rootNodeList.map(async node => {
            let nodeName = await node.value();
            if (nodeName.indexOf(root) !== -1) {
                targetItem = node;
            }
        }));
    }
    dirNamePath[0] = await targetItem.value();
    await tree.scrollTo(dirNamePath);
    this.dirNamePath = dirNamePath;
});

Then("Select the target tree node and verify", async function () {
    let targetItem = await model.getTree('Dir_View').getItem(this.dirNamePath);
    // If the target is not in the clickable area, it will expand to the node position
    await targetItem.scrollIntoView();
    await targetItem.expand();
    let isChecked = await targetItem.expanded();
    assert.equal(isChecked, true, "The target tree node is not selected");
});

Then("Expand the target tree node to the visible range", async function () {
    let targetItem = this.item;
    await targetItem.scrollIntoView();
});

Given("The itemPath of the target tree node is {string}, get the object of the tree node", async function (itemPathString) {
    let itemPath = JSON.parse(itemPathString);
    let targetItem = model.getTree("Dir_View").getItem(itemPath);
    if (!targetItem) {
        throw "target TreeItem is not exist in this itemPath " + itemPathString;
    }
    this.dirNamePath = itemPath;
    this.item = targetItem;
});

Then("Application screenshot", async function () {
    let screenshot = await model.getTree("Dir_View").takeScreenshot();
    this.attach(screenshot, 'image/png');
});
