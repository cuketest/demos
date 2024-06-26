const { Given, When, Then } = require('cucumber');
const { After, AfterAll, BeforeAll, setDefaultTimeout } = require('cucumber');
const { QtAuto } = require('leanpro.qt');
const { Util } = require('leanpro.common');
const { CukeTest } = require('cuketest');
const path = require("path");

// Load the UI model file of the Qt application
let model = QtAuto.loadModel(__dirname + "/model.tmodel");

/// Timeout and Hook settings ///
setDefaultTimeout(60 * 1000);  //set step timeout to be 60 seconds
let child;

// Prepare the test environment before executing all test scenarios, start the application under test, and wait for it to appear.
BeforeAll(async function () {
    CukeTest.minimize();
    
    // CukeTest default sample path
    let sampleDir = path.dirname(process.execPath) 
    // Multiple startup paths are passed in for different systems, and the available paths will be automatically selected
    child = await QtAuto.launchQtProcessAsync([  
        // Linux
        sampleDir + "/bin/dirview",
        // Windows
        sampleDir + "\\bin\\dirview.exe",
        // Mac
        '/Applications/CukeTest.app/Contents/Frameworks/dirview', 
    ]); 

    // Wait for the tested application process to appear, with a maximum waiting time of 10 seconds.
    await model.getApplication("dirview").exists(10);
})

// Capture a screenshot of the current window after each test scenario and attach it to the test report.
After(async function () {
    let screenshot = await model.getTree("Dir_View").takeScreenshot();
    this.attach(screenshot, 'image/png');
    await Util.delay(2000);
})

// After all test scenarios are executed, close the tested application.
AfterAll(async function () {

    // Restore the CukeTest window size for the next round of testing or end of testing work.
    CukeTest.restore();
    CukeTest.maximize();

    // Close the launched test application process.
    Util.stopProcess(child)
})

//// your step definition /////
// {string} placeholder receives a string type parameter, with the string passed to the relativePath variable
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

    // Scroll to the location of the directory path
    await tree.scrollTo(dirNamePath);

    // Save the updated directory path array to the current context for later step calls
    this.dirNamePath = dirNamePath;
});

Then("Select the target tree node and verify", async function () {
    let targetItem = await model.getTree('Dir_View').getItem(this.dirNamePath);
    // If the target is not in the clickable area, it will expand to the node position
    await targetItem.scrollIntoView();
    await targetItem.expand();

    // Check if the expanded property is true, displaying the specified message if it is not
    await targetItem.checkProperty('expanded', true, 'The target tree node is not selected')
});

Then("Expand the target tree node to the visible range", async function () {
    let targetItem = this.item;

    // Scroll to the visible range of the target node
    await targetItem.scrollIntoView();
});

// {string} placeholder receives a string type parameter, with the string passed to the itemPathString variable
Given("The itemPath of the target tree node is {string}, get the object of the tree node", async function (itemPathString) {

    // Parse the string type into an array
    let itemPath = JSON.parse(itemPathString);

     // Get the node object
    let targetItem = model.getTree("Dir_View").getItem(itemPath);
    if (!targetItem) {
        throw "target TreeItem is not exist in this itemPath " + itemPathString;
    }
    this.dirNamePath = itemPath;
    this.item = targetItem;
});

Then("Application screenshot", async function () {

    // Capture a screenshot of the application and add it to the report
    let screenshot = await model.getTree("Dir_View").takeScreenshot();
    this.attach(screenshot, 'image/png');
});
