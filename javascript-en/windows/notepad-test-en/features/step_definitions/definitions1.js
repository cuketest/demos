const fs = require('fs');
const assert = require('assert');
const os = require('os')
const { Image, Ocr } = require('leanpro.visual');
const { Given, When, Then, BeforeAll, AfterAll, setDefaultTimeout } = require('cucumber');
const { CukeTest } = require('cuketest');
const { WinAuto } = require('leanpro.win');
const { Util } = require('leanpro.common');

// Load different UI model files for Windows applications based on the operating system
let osModelMapping = {
    "Windows 10 and below": "/model.tmodel",
    "Windows 11": "/modelWin11.tmodel"
};
let model = WinAuto.loadModel(__dirname + osModelMapping[osName]);

// Set the project path
const projectPath = process.cwd() + '\\features\\data\\';

// Set the timeout for steps to 20 seconds
setDefaultTimeout(20 * 1000);

// Prepare the test environment before executing all test scenarios.
BeforeAll(async function () {
    
    // If the project path exists, delete the path and all its contents to clear the cache
    if (fs.existsSync(projectPath)) {
        fs.rmdirSync(projectPath, { recursive: true });
    }

    // Create the project path
    fs.mkdirSync(projectPath);

    // Minimize the CukeTest window
    await CukeTest.minimize();
})

// After all test scenarios have executed, close the tested application.
AfterAll(async function () {
    await model.getWindow("Notepad").close();
    await CukeTest.restore();
    await CukeTest.maximize();
})

//// your step definition /////

When("Open the Windows Notepad app", async function () {
    
    // Launch the local Notepad application
    Util.launchProcess('notepad.exe');
    await model.getDocument("Text Editor").exists(5);
    await model.getWindow("Notepad").maximize()
});

When("Click [File]--[New]", async function () {
    await model.getMenuItem("File").click();
    await model.getMenuItem("New").invoke();
});

// {string} Placeholder receives a string type parameter, which is passed to the variable "text"
When("Enter the text {string} in Notepad", async function (text) {
    await model.getDocument("Text Editor").set(text);
    this.text = text;

    // Check if the value property matches the expected value.
    await model.getDocument("Text Editor").checkProperty("value", text)
});

When("Click [File]--[Save]", async function () {
    await model.getMenuItem("File").click();

    // Press the save button
    await model.getMenuItem("Save").invoke();
});

// {string} Placeholder receives a string type parameter, which is passed to the variable "filename"
When("Save as {string} in the project path in the file dialog box", async function (filename) {
    let filepath = projectPath + filename;
    this.filepath = filepath;
    if (fs.existsSync(filepath)) {

        // File may exist when running repeatedly
        fs.unlinkSync(filepath);
    }
    await model.getEdit("File_name:1").set(filepath);

    // On Win11, an event is generated for the file dialog
    await model.getEdit("File_name:1").pressKeys(' ');
    await model.getButton("Save1").click();
    await Util.delay(2000);
});

Then("The file should be saved successfully", async function () {
    
    // Verify that the file exists
    let filepath = this.filepath;
    let exist = fs.existsSync(filepath);

    // Assert that the file exists
    assert.strictEqual(exist, true);
    console.log(filepath + "The file is created");

    // Read the file content and use assertion to verify if the file content matches the expected value
    let filecontent = fs.readFileSync(filepath, { encoding: 'utf-8' });
    assert.strictEqual(filecontent, this.text);
    console.log(`The contents of the file are: ${filecontent}`);
});

When("Click [Format]--[Font]", async function () {
    await model.getMenuItem("Format").click();

    // Press the font button
    await model.getMenuItem("Font...").invoke();
});

// {string} Placeholder receives a string type parameter, which is passed to the variable "font"
When("Select {string} from the [Font] drop-down box", async function (font) {
    
    // Wait for the font dropdown to be enabled before making a selection
    await model.getComboBox("Font:").waitProperty("enabled", true, 3)
    await model.getComboBox("Font:").select(font);
    await Util.delay(500);
});

// {string} Placeholder receives a string type parameter, which is passed to the variable "weight"
When("Select {string} from the [Font Style] drop-down box", async function (weight) {
    
    // If the current system is Win 11, select Bold
    if (osName == "Windows 11") {
        weight = "Bold"
    }
    await model.getComboBox("Font style:").select(weight);
    await Util.delay(500);
});

// {string} Placeholder receives a string type parameter, which is passed to the variable "size"
When("Select {string} from the [Size] drop-down box", async function (size) {
    await model.getComboBox("Size:").select(size);
    await Util.delay(500);
    if (osName == "Windows 11") {
        if (await model.getButton("Close").exists()) {
            await model.getButton("Close").click()
        }
    }
});

When("Click the [OK] button to close the [Font...] dialog box", async function () {
    await model.getButton("OK").click();
    await Util.delay(500);
});

Then("The font should be set successfully", async function () {
    
     // Compare the screenshot data of the current text editing area with the expected image to verify the correctness of the interface elements.
    let screenshot = await model.getVirtual("virtual").takeScreenshot();
    let expectedImage = await Image.fromData(await model.getVirtual("virtual").modelImage());
    
    let compareInfo = await Image.imageCompare(expectedImage, actualImage, {
        // Maximum pixel percentage difference tolerance allowed
        pixelPercentTolerance: 10,
        // Ignore extra parts in the image
        ignoreExtraPart: true
    });

    // OCR recognizes the text content in the screenshot and adds it to the report
    let ocrResult = await Ocr.getVisualText(screenshot)
    this.attach('The result of the OCR read is: ' + ocrResult)
    this.attach(await compareInfo.diffImage.getData(), 'image/png');
    let result = await Image.imageEqual(expectedImage, actualImage, {
        pixelPercentTolerance: 10,
        ignoreExtraPart: true
    })
    assert.strictEqual(result, true, "Font Setting Failed");
});


/**

Get the name of the operating system.
@returns {string} Returns the name of the operating system, which may be "Windows 11" or "Windows 10 and below".
*/
function getOSname() {
    let osRelease = os.release();
    let osReleaseSplit = osRelease.split(".");
    let osReleaseTail = osReleaseSplit[osReleaseSplit.length - 1];
    if (parseInt(osReleaseTail) > 20000) {
        return "Windows 11";
    } else {
        return "Windows 10 and below";
    }
}