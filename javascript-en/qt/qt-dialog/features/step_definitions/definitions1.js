const path = require('path');
const { Given, When, BeforeAll, After, AfterAll, setDefaultTimeout } = require('cucumber');
const { QtAuto } = require('leanpro.qt');
const { Util } = require('leanpro.common');

// set step timeout to be 60 seconds
setDefaultTimeout(60 * 1000); 

// Load UI model file for Qt application
let model = QtAuto.loadModel(__dirname + "/model1.tmodel");
let child;

// Prepare test environment before all test scenarios execute, start the application under test and wait for its appearance.
BeforeAll(async function () {

    // Determine the sample directory path based on the execution environment.
    let sampleDir = path.dirname(process.execPath); 
    
    // Provide multiple launch paths based on system for automatic selection of available paths
    child = await QtAuto.launchQtProcessAsync([  
        // Linux
        `${sampleDir}/bin/standarddialogs`, 
        // Windows
        `${sampleDir}\\bin\\standarddialogs.exe`, 
        // Mac
        '/Applications/CukeTest.app/Contents/Frameworks/standarddialogs', 
    ]); 

    // Wait for the application process under test to appear, with a maximum wait time of 10 seconds.
    await model.getApplication("standarddialogs").exists(10);
})

// After all test scenarios execute, close the application under test.
After(async function () {
    let screen = await model.getWindow("Standard_Dialogs").takeScreenshot()
    this.attach(screen, "image/png")
})

// After all test scenarios execute, close the application under test.
AfterAll(async function () {

    // Close the launched test application process.
    Util.stopProcess(child);
})

//// Your step definitions /////
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

// {int} placeholder receives an integer type parameter which is passed to the value variable
When("Modify the value of the value box to {int}", async function (value) {

    // Wait for the text dialog to open
    await model.getWindow("QInputDialog::getInteger()").exists(1);
    await model.getEdit("qt_spinbox_lineedit").set(value);
    await Util.delay(1000);
    await model.getButton("OK").click()

    // Check if the value is successfully modified by getting the value of the next Label control of the button
    let labelControl = await model.getButton("QInputDialog::getInt()").next("Label");
    await labelControl.checkProperty("text", value + '%', 'Failed to modify the value')
});

// {string} placeholder receives a string type parameter which is passed to the season variable
When("Modify the value of the drop-down box to {string}", async function (season) {
    await model.getComboBox("ComboBox").select(season);
    await Util.delay(1000);
    await model.getButton("OK").click()

    // Check if the value is successfully modified by getting the value of the next Label control of the button
    let labelControl = await model.getButton("QInputDialog::getItem()").next("Label");
    await labelControl.checkProperty('text', season, 'Failed to modify the dropdown')
});

// Use the docString variable to receive the document string passed in the test step
When("Modify the content of the text box as follows", async function (docString) {
    await model.getEdit("Edit").set(docString);
    await Util.delay(1000);
    await model.getButton("OK").click();

    // Check if the value is successfully modified by getting the value of the next Label control of the button
    let labelControl = await model.getButton("QInputDialog::getMultiLineTex").next("Label");
    await labelControl.checkProperty('text', docString, 'Failed to modify the text box content')
});
