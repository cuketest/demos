const { Image } = require('leanpro.visual');
const { BeforeAll, AfterAll, setDefaultTimeout } = require('cucumber');
const { CukeTest } = require('cuketest');
const { Given, When, Then } = require('cucumber');
const { WinAuto } = require('leanpro.win');
const { Util } = require('leanpro.common');
const fs = require('fs');
const assert = require('assert');
let model = WinAuto.loadModel(__dirname + "/model1.tmodel");  

const projectPath = process.cwd() + '\\features\\data\\';

setDefaultTimeout(60 * 1000);
BeforeAll(async function () {
    if (fs.existsSync(projectPath)){
        fs.rmdirSync(projectPath, { recursive: true });
    }
    fs.mkdirSync(projectPath);
    await CukeTest.minimize();
})

AfterAll(async function () {
    await model.getWindow("Notepad").close();
    await CukeTest.restore();
    await CukeTest.maximize();
})

//// your step definition /////

When("Open the Windows Notepad app", async function () {
    Util.launchProcess('notepad.exe');
    await model.getDocument("Text Editor").exists(5);
    await model.getWindow("Notepad").restore()
});

When("Click [Format]--[Font]", async function () {
    await model.getMenuItem("Format").click();
    await model.getMenuItem("Font...").click();
});


When("Enter the text {string} in Notepad", async function (text) {
    await model.getDocument("Text Editor").set(text);
    this.text = text;
});

When("Click [File]--[Save]", async function () {
    await model.getMenuItem("File").click();
    await model.getMenuItem("Save").click();
});

When("Save as {string} in the project path in the file dialog box", async function (filename) {
    let filepath = projectPath + filename;
    this.filepath = filepath;
    await model.getEdit("File name:1").set(filepath);
    await model.getButton("Save1").click();
    await Util.delay(2000);
});
Then("The file should be saved successfully", async function () {
    let filepath = this.filepath;
    let exist = fs.existsSync(filepath);
    assert.strictEqual(exist, true);
    console.log(filepath + "The file is created");

    let filecontent = fs.readFileSync(filepath, { encoding: 'utf-8' });
    assert.strictEqual(filecontent, this.text);
    console.log(`The contents of the file are: ${filecontent}`);
});
When("Select {string} from the [Font] drop-down box", async function (font) {
    await model.getComboBox("Font:").select(font);
    await Util.delay(500);
});
When("Select {string} from the [Font Style] drop-down box", async function (weight) {
    await model.getComboBox("Font style:").select(weight);
    await Util.delay(500);
});
When("Select {string} from the [Size] drop-down box", async function (size) {
    await model.getComboBox("Size:").select(size);
    await Util.delay(500);
});
When("Click the [OK] button to close the [Font...] dialog box", async function () {
    await model.getButton("OK").click();
    await Util.delay(500);
});
Then("The font should be set successfully", async function () {
    let screenshot = await model.getDocument("Text Editor").takeScreenshot();
    let expectedImage = await Image.fromData(await model.getDocument("Text Editor").modelImage());
    let actualImage = await Image.fromData(screenshot);
    let result = await Image.imageCompare(expectedImage, actualImage, {
        pixelPercentTolerance: 1,
        ignoreExtraPart: true
    });
    this.attach(await result.diffImage.getData(), 'image/png');
    assert.strictEqual(result.equal, true);
});
