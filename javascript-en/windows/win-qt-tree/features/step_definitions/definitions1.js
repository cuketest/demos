const { Given, When, Then, BeforeAll, AfterAll, setDefaultTimeout } = require('cucumber');
const { WinAuto } = require('leanpro.win');
const { Util } = require('leanpro.common');
const assert = require('assert');
const path = require("path");

setDefaultTimeout(60 * 1000);
let model = WinAuto.loadModel(__dirname + "/model.tmodel");
let child;

BeforeAll(async function () {
    child = Util.launchSample("dirview.exe");
    if (!await model.getWindow("Window").exists(5)) {
        throw new Error("Testing application was not launched.");
    }
});

AfterAll(async function () {
    await Util.stopProcess(child);
})

//// your step definition /////

Given("Click on the tree node in the model{string}", async function (treeItemName) {
    await model.getTreeItem(treeItemName).click(0, 0, 1);
});

Given("Expand and collapse tree nodes in a model{string}", async function (treeItemName) {
    await model.getTreeItem(treeItemName).expand();
    await Util.delay(2000);
    await model.getTreeItem(treeItemName).collapse();
});

Given("Click on {string} in the tree", async function (pathString) {
    let treepath = JSON.parse(pathString);
    await model.getTree("Tree").select(treepath);
});

Given("Collapse and expand {string} in tree", async function (pathString) {
    let treepath = JSON.parse(pathString);
    console.log(treepath);
    await model.getTree("Tree").showHeader(3)
    await model.getTree("Tree").childCount(treepath);
});

Given("Access and select the {string} file", async function (relativePath) {
    let treepath = path.resolve(__dirname, '..', relativePath).split('\\');
    let tree = model.getTree('Tree');
    let foundFlag = false;
    // Because the disk name is different, here is the disk name in the path to be modified
    // Get full disk name by disk letter (eg "C:")
    treepath[0] = await getDiskName(treepath[0])
    this.item = await tree.select(treepath);
    this.treepath = treepath;
});

Then("{string} node selected", async function (expectedItemName) {
    let itemName = await this.item.name();
    assert.strictEqual(itemName, expectedItemName);
    let selected = await this.item.focused();
    assert.strictEqual(selected, true);
});

async function getDiskName(deskSign){
    let [diskItem, _] = await model.getTree("Tree").findControls({
        "type": "TreeItem",
        "name~": deskSign
    })
    return diskItem.name();
}
