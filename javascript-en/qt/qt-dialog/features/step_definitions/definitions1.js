const assert = require('assert');
const path = require('path');
const { Given, When, BeforeAll, After, AfterAll, setDefaultTimeout } = require('cucumber');
const { QtAuto } = require('leanpro.qt');
const { Util } = require('leanpro.common');

setDefaultTimeout(60 * 1000); //set step timeout to be 60 seconds
let model = QtAuto.loadModel(__dirname + "/model1.tmodel");
let child;

BeforeAll(async function () {
    let sampleDir = path.dirname(process.execPath) // CukeTest default sample path
    child = await QtAuto.launchQtProcessAsync([  // Multiple startup paths are passed in for different systems, and the available paths will be automatically selected
        sampleDir + "/bin/standarddialogs",
        sampleDir + "\\bin\\standarddialogs.exe"
    ]); 
    await model.getApplication("standarddialogs").exists(10);
})

After(async function () {
    let screen = await model.getWindow("Standard_Dialogs").takeScreenshot()
    this.attach(screen, "image/png")
})

AfterAll(async function () {
    Util.stopProcess(child);
})

//// your step definition /////
Given("Open the value dialog", async function () {
    await model.getButton("Input dialog").click();
    await model.getButton("QInputDialog::getInt()").click();
});

Given("Open drop down dialog", async function () {
    await model.getButton("Input dialog").click();
    await model.getButton("QInputDialog::getItem()").click();
});

Given("Open text dialog", async function () {
    await model.getButton("QInputDialog::getMultiLineTex").click();
});

When("Modify the value of the value box to {int}", async function (value) {
    await model.getWindow("QInputDialog::getInteger()").exists(1);
    await model.getEdit("qt_spinbox_lineedit").set(value);
    await Util.delay(1000);
    await model.getButton("OK").click()
    let labelControl = await model.getButton("QInputDialog::getInt()").next("Label");
    let inputValue = parseInt(await labelControl.text(), 10);
    assert.equal(inputValue, value, "Failed to modify the value");
});

When("Modify the value of the drop-down box to {string}", async function (season) {
    await model.getComboBox("ComboBox").select(season);
    await Util.delay(1000);
    await model.getButton("OK").click()
    let labelControl = await model.getButton("QInputDialog::getItem()").next("Label");
    let selectedValue = await labelControl.text();
    assert.equal(selectedValue, season, "Failed to modify the drop-down box");
});

When("Modify the content of the text box as follows", async function (docString) {
    await model.getEdit("Edit").set(docString);
    await Util.delay(1000);
    await model.getButton("OK").click();
    let labelControl = await model.getButton("QInputDialog::getMultiLineTex").next("Label");
    let textValue = await labelControl.text();
    assert.equal(textValue, docString, "no success textbox content");
});
