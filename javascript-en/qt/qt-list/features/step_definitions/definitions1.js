const { Keyboard } = require('leanpro.common');
const { Util } = require('leanpro.common');
const { QtAuto } = require('leanpro.qt');
const { Given, When, Then } = require('cucumber');
const { BeforeAll, After, AfterAll, setDefaultTimeout } = require('cucumber');
const { CukeTest } = require('cuketest');
const { join, dirname } = require('path');
const model = QtAuto.loadModel(__dirname + "/model1.tmodel");
const {RunSettings} = require('leanpro.common')
/// Timeout and Hook settings ///
setDefaultTimeout(60 * 1000);
let child;
BeforeAll(async function () {
    CukeTest.minimize();
    let sampleDir = dirname(process.execPath) // CukeTest default sample path
    child = await QtAuto.launchQtProcessAsync([  // Multiple startup paths are passed in for different systems, and the available paths will be automatically selected
        sampleDir + "/bin/fetchmore",
        sampleDir + "\\bin\\fetchmore.exe"
    ]); 
    await model.getApplication("fetchmore").exists(10);
});

After(async function () {
    await Util.delay(2000);
    let screenshot = await model.getWindow("Fetch_More_Example").takeScreenshot();
    this.attach(screenshot, 'image/png');
});

AfterAll(async function () {
    CukeTest.restore();
    CukeTest.maximize();
    await Util.stopProcess(child);
});

//// your step definition /////

When("Search for {string} in the CukeTest installation path", async function (dir) {
    let installPath = dirname(process.execPath);
    await model.getEdit("Edit").set(join(installPath, dir));
});

Then("Click on the option {string}", async function (fileName) {
    let listObject = model.getList("List");
    let targetItem;
    while (true) {
        if (targetItem = await listObject.findItem(fileName)) break;
        let count = await listObject.itemCount();
        await listObject.scrollToBottom(); //Loading options for lazy loading
        await Util.delay(1000);
        let newCount = await listObject.itemCount();
        if (newCount === count) break;  // Scroll to the bottom to reach the bottom without loading new options
    }
    if (!targetItem) throw 'object not found: ' + fileName;
    let index = await targetItem.itemIndex();
    await listObject.scrollTo(index);
    RunSettings.slowMo = 0
    let item = await listObject.getItem(index);
    await item.select();
    await item.highlight();
});

Then("Click on option {int}", async function (itemIndex) {
    let listObject = model.getList("List");
    await listObject.scrollTo(itemIndex);
    let item = await listObject.getItem(itemIndex);
    await item.select();
    await item.highlight()
});


Given("The action object is the {int}th option in the list", async function (itemIndex) {
    let targetItem = model.getList('List').getItem(itemIndex);
    this.targetItem = targetItem;
});

Then("Jump to target option position", async function () {
    let targetItem = this.targetItem;
    await targetItem.scrollIntoView();
});

Then("Click on the target option", async function () {
    let targetItem = this.targetItem;
    await targetItem.select();
    await targetItem.highlight();
});
