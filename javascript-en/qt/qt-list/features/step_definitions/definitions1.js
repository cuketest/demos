const { Keyboard } = require('leanpro.common');
const { Util } = require('leanpro.common');
const { QtAuto } = require('leanpro.qt');
const { Given, When, Then } = require('cucumber');
const { BeforeAll, After, AfterAll, setDefaultTimeout } = require('cucumber');
const { CukeTest } = require('cuketest');
const { join, dirname } = require('path');
const os = require('os');

// Load the UI model file of the Qt application
const model = QtAuto.loadModel(__dirname + "/model1.tmodel");
const {RunSettings} = require('leanpro.common')
/// Timeout and Hook settings ///
setDefaultTimeout(60 * 1000);
let child;

// Prepare the test environment before executing all test scenarios, start the application under test and wait for its appearance.
BeforeAll(async function () {
    // Minimize the CukeTest window to avoid interference with UI testing.
    CukeTest.minimize();

    // Determine the sample directory path based on the execution environment.
    let sampleDir = dirname(process.execPath); // Default sample path for CukeTest

    // Provide multiple launch paths based on system for automatic selection of available paths
    child = await QtAuto.launchQtProcessAsync([
        // Linux
        `${sampleDir}/bin/fetchmore`, 
        // Windows
        `${sampleDir}\\bin\\fetchmore.exe`, 
        // Mac
        '/Applications/CukeTest.app/Contents/Frameworks/fetchmore', 
    ]);

    // Wait for the application process under test to appear, with a maximum wait time of 10 seconds.
    await model.getApplication("fetchmore").exists(10);
});

// Capture a screenshot of the current window after executing each test scenario and attach it to the test report.
After(async function () {
    await Util.delay(2000);
    let screenshot = await model.getWindow("Fetch_More_Example").takeScreenshot();
    this.attach(screenshot, 'image/png');
});

// After all test scenarios execute, close the application under test.
AfterAll(async function () {
    // Restore the CukeTest window size, preparing for the next round of testing or finishing testing work.
    CukeTest.restore();
    CukeTest.maximize();

    // Close the launched test application process.
    await Util.stopProcess(child);
});

//// your step definition /////
// {string} placeholder receives a string type parameter which is passed to the dir variable
When("Search for {string} in the CukeTest installation path", async function (dir) {
    // Determine the installation path based on the operating system type and search in the specified directory
    let installPath, targetDir;
    if (getOSType() === 'macOS') {
        installPath = '/Applications/CukeTest.app/Contents';
        targetDir = join(installPath, 'Frameworks');
    } else {
        installPath = dirname(process.execPath);
        targetDir = join(installPath, 'bin');
    }

    // Enter the search path in the search box
    await model.getEdit("Edit").set(join(targetDir, dir));

    // Wait for 100 milliseconds to ensure that the search operation has been triggered
    await Util.delay(100);
});

// {string} placeholder receives a string type parameter which is passed to the fileName variable
Then("Click on the option {string}", async function (fileName) {
    let listObject = model.getList("List");
    let targetItem;
    while (true) {
        // Find the specified file name in the list
        if (targetItem = await listObject.findItem(fileName)) break;

        // Get the current number of list items and attempt to scroll to the bottom to load more items
        let count = await listObject.itemCount();
        await listObject.scrollToBottom();

        // Wait for loading to complete
        await Util.delay(1000);
        let newCount = await listObject.itemCount();

        // If the number of items does not increase, it means that the bottom has been scrolled to
        if (newCount === count) break;
    }
    if (!targetItem) throw 'object not found: ' + fileName;

    // Scroll to the target item and select it for highlighting
    let index = await targetItem.itemIndex();
    await listObject.scrollTo(index);
    let item = await listObject.getItem(index);
    await item.select();
    await item.highlight();
});

// {int} placeholder receives an integer type parameter which is passed to the itemIndex variable
Then("Click on option {int}", async function (itemIndex) {
    let listObject = model.getList("List");

    // Scroll to the specified index of the list item
    await listObject.scrollTo(itemIndex);
    let item = await listObject.getItem(itemIndex);

    // Select and highlight the list item
    await item.select();
    await item.highlight();
});

// {int} placeholder receives an integer type parameter, and the integer value is passed to the itemIndex variable
Given("The operation is performed on the item with the index {int} in the list", async function (itemIndex) {
    let targetItem = model.getList('List').getItem(itemIndex);
    this.targetItem = targetItem;
});

Then("Jump to target option position", async function () {
    let targetItem = this.targetItem;

    // Scroll the view to make the target option visible
    await targetItem.scrollIntoView();
});

Then("Click on the target option", async function () {
    let targetItem = this.targetItem;

    // Select and highlight the target option
    await targetItem.select();
    await targetItem.highlight();
});

function getOSType() {
    // Get the platform information of the current operating system, such as "win32" for Windows.
    const platform = os.platform();

    switch (platform) {
        case 'win32':
            return 'Windows';
        case 'linux':
            return 'Linux';
        case 'darwin':
            return 'macOS';
        default:
            return 'Unknown';
    }
}