const assert = require('assert');
const fs = require('fs');
const path = require('path');

const { Keyboard, Util } = require('leanpro.common');
const { _electron } = require('leanpro.web');
const { WinAuto } = require("leanpro.win");
const { CukeTest } = require('cuketest');
const { BeforeAll, AfterAll, Given, When, Then, setDefaultTimeout } = require('cucumber');

const selectors = require('./selectors.json');

// Clear the default timeout
setDefaultTimeout(-1);

// Load the UI model file of the Windows application
let model = WinAuto.loadModel(".\\features\\main.tmodel");
let app, window;

// Prepare the test environment before executing all test scenarios
BeforeAll(async function () {

    // Minimize the CukeTest window to avoid interference with UI testing.
    CukeTest.minimize();

    // Attempt to delete the test cache directory, ignoring if it does not exist
    try {
        fs.rmdirSync(path.join(__dirname, '../testing-cache'), { recursive: true})
    } catch(e) {} finally {

        // Ensure the creation of the test cache directory and its subdirectories
        fs.mkdirSync(path.join(__dirname, '../testing-cache'))
        fs.mkdirSync(path.join(__dirname, '../testing-cache/screenshots'))
    }

    // Launch the Electron application
    app = await _electron.launch({
        executablePath: process.execPath,
        args: ['--no-qt', "--no-detach"]
    });

    // Get the context of the application
    let context = await app.context();

    // Set the default timeout to 10000 milliseconds (10 seconds)
    context.setDefaultTimeout(10000);

    // Get the first window
    window = await app.firstWindow();

    // Wait for the element with the selector "Open" to appear
    await window.waitForSelector(selectors["Open"]);
    await Keyboard.pressKeys("^0")
});

// After executing all test scenarios, close the tested application and maximize the CukeTest window
AfterAll(async function () {
    await window.close();
    CukeTest.maximize();
});

// {string} placeholder receives a string parameter passed to the variable btnName
Then("Click {string} button", async function (btnName) {
    window.click(selectors[btnName]);
    await window.screenshot({ path: path.join(__dirname, '../testing-cache/screenshots', `Click ${btnName}.png`) })
});

// {string} placeholder receives a string parameter passed to the variable btnName, and another string is passed to the variable itemName
Then("Click {string} in the {string} drop-down button", async function (itemName, btnName) {
    await window.click(selectors[`${btnName} drop-down`]);
    await window.screenshot({ path: path.join(__dirname, '../testing-cache/screenshots', `Click ${btnName} select-${itemName} drop down box completed.png`) })
    await window.click(selectors[`${btnName} select-${itemName}`]);
    await window.screenshot({ path: path.join(__dirname, '../testing-cache/screenshots', `Select ${btnName} select-${itemName} drop down box.png`) })
});

// {string} placeholder receives a string parameter passed to the variable fileName
Then("Save as {string}", async function (fileName) {
    await model.getEdit("Save File Name").clearAll();

    await Keyboard.disableIme();
    await model.getEdit("Save File Name").pressKeys(path.join(__dirname, '../testing-cache', fileName));
    await model.getButton("Save").click();
    await Util.delay(2000);
});

// {string} placeholder receives a string parameter passed to the variable fileName
Then("Verify that the {string} file exists", async function (fileName) {
    let fullname = path.join(__dirname, '../testing-cache', fileName);

    // Check if the file exists
    let isExist = fs.existsSync(fullname)
    assert.strictEqual(isExist, true, `no files found ${fullname}`);
});

// {string} placeholder receives a string parameter passed to the variable projectDir
Then("Open project {string}", async function (projectDir) {
    let title = await model.getPane("CukeTest window").property("title");
    await window.click(selectors["Open Project"]);

    // Input project path
    let fullpath = path.join(__dirname, projectDir);
    await model.getEdit("Open folder").set(fullpath);
    await model.getButton("Select Folder").click();
    await Util.delay(2000)
});


// {string} placeholder receives a string parameter passed to the variable fileDir
Then("Open file {string}", async function (fileDir) {
    await window.click(selectors["Open"]);

    // Input file path
    let fullpath = path.join(__dirname, fileDir);
    await model.getEdit("Open File Name").set(fullpath);

    // Handle possible different buttons
    try{
        await model.getButton("Open").click();
    }catch(e){}
    try{
        await model.getGeneric("Open with drop-down box").click();
    }catch(e){}
});

Then("Wait for the run to finish", async function () {
    const ele = await window.$(selectors["Stop Run"]);
    // Wait for the project/story/script to finish running
    // The criterion is whether the "Stop Execution" button is restored
    while (true){
        if ((await ele.getAttribute("class")).match("disabled")){
            await Util.delay(500);
            if ((await ele.getAttribute("class")).match("disabled")) {
                break;
            }
        }
    }
});

Then("The running results appear in the output column include the following", async function (docString) {
    await Util.delay(3000)

    // Get the text content of the output bar and add it to the report for easy viewing
    let outputMessageBox = await window.$(selectors["Output Bar"]);
    let outputMessage = await outputMessageBox.innerText();
    console.log('outputMessage==',outputMessage)

    // Check whether the specified content appears in the output bar to verify whether the project is running
    assert.equal(outputMessage.indexOf(docString) > 0, true, "Project not running");
    
});

Given("Click the {string} button to open a new window", async function (btnName) {
    await window.click(selectors[btnName]);    
    let newWindow = await app.waitForEvent('window'); // Wait for new window
    console.log(await newWindow.title());
    this.newWindow = newWindow;
});

When("Screenshot Model Manager", async function () {
    const mmWindow = this.newWindow;
    let screenshot = await mmWindow.screenshot({ path: path.join(__dirname, '../testing-cache/screenshots', `mm_helper.png`) });
    this.attach(screenshot, 'image/png')
});

Then("Close the model manager", async function () {
    const mmWindow = this.newWindow;
    await mmWindow.close();
});

function log(str) {
    console.log(str);
    this.attach(str);
}