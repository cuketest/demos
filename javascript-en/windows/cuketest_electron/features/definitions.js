const assert = require('assert');
const fs = require('fs');
const path = require('path');

const { Keyboard, Util } = require('leanpro.common');
const { _electron } = require('leanpro.web');
const { WinAuto } = require("leanpro.win");
const { CukeTest } = require('cuketest');
const { BeforeAll, AfterAll, Given, When, Then, setDefaultTimeout } = require('cucumber');

const selectors = require('./selectors.json');

setDefaultTimeout(-1);

let model = WinAuto.loadModel(".\\features\\main.tmodel");
let app, window;

BeforeAll(async function () {
    CukeTest.minimize();

    try {
        fs.rmdirSync(path.join(__dirname, '../testing-cache'), { recursive: true})
    } catch(e) {} finally {
        fs.mkdirSync(path.join(__dirname, '../testing-cache'))
        fs.mkdirSync(path.join(__dirname, '../testing-cache/screenshots'))
    }

    app = await _electron.launch({
        executablePath: process.execPath,
        args: ['--no-qt', "--no-detach"]
    });
    let context = await app.context();
    context.setDefaultTimeout(10000);
    window = await app.firstWindow();
    await window.waitForSelector(selectors["Open"]);
    await Keyboard.pressKeys("^0")
});

AfterAll(async function () {
    await window.close();
    CukeTest.maximize();
});

Then("截图为{string}", async function (imgName) {
    await window.screenshot({ path: path.join(__dirname, '../testing-cache/screenshots', `${imgName }.png`) })
});

Then("Click {string} button", async function (btnName) {
    window.click(selectors[btnName]);
    await window.screenshot({ path: path.join(__dirname, '../testing-cache/screenshots', `Click ${btnName}.png`) })
});

Then("Click {string} in the {string} drop-down button", async function (itemName, btnName) {
    await window.click(selectors[`${btnName} drop-down`]);
    await window.screenshot({ path: path.join(__dirname, '../testing-cache/screenshots', `Click ${btnName} select-${itemName} drop down box completed.png`) })
    await window.click(selectors[`${btnName} select-${itemName}`]);
    await window.screenshot({ path: path.join(__dirname, '../testing-cache/screenshots', `Select ${btnName} select-${itemName} drop down box.png`) })
});

Then("Save as {string}", async function (fileName) {
    await model.getEdit("Save File Name").set(path.join(__dirname, '../testing-cache', fileName));
    await model.getButton("Save").click();
    await Util.delay(2000);
});

Then("Verify that the {string} file exists", async function (fileName) {
    let fullname = path.join(__dirname, '../testing-cache', fileName);
    let isExist = fs.existsSync(fullname)
    assert.strictEqual(isExist, true, `no files found ${fullname}`);
});

Then("Open project {string}", async function (projectDir) {
    let title = await model.getPane("CukeTest window").property("title");
    await window.click(selectors["Open Project"]);
    let fullpath = path.join(__dirname, projectDir);
    await model.getEdit("Open folder").set(fullpath);
    await model.getButton("Select Folder").click();
});

Then("Open file {string}", async function (fileDir) {
    await window.click(selectors["Open"]);
    let fullpath = path.join(__dirname, fileDir);
    await model.getEdit("Open File Name").set(fullpath);
    try{
        await model.getButton("Open").click();
    }catch(e){}
    try{
        await model.getGeneric("Open with drop-down box").click();
    }catch(e){}
});

Then("Wait for the run to finish", async function () {
});

Then("The running results appear in the output column include the following", async function (docString) {
    let outputMessageBox = await window.$(selectors["Output Bar"]);
    let outputMessage = await outputMessageBox.innerText();
    assert.equal(outputMessage.indexOf(docString) > 0, true, "Project not running");
    
});

Given("点击一个元素", async function () {
    await window.click("li.edit_icon.hashover >> nth=3");
});

Given("打开帮助菜单", async function () {
    Keyboard.keyTap('f1');  // This will open a new window
    let newWindow = await app.waitForEvent('window'); // Wait for new window
    console.log(await newWindow.title());
    this.docWindow = newWindow;
});

Then("关闭帮助菜单", async function () {
    await this.docWindow.close();
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