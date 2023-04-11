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
    await window.waitForSelector(selectors["打开"]);
    await Keyboard.pressKeys("^0")
});

AfterAll(async function () {
    await window.close();
    CukeTest.maximize();
});

Then("截图为{string}", async function (imgName) {
    await window.screenshot({ path: path.join(__dirname, '../testing-cache/screenshots', `${imgName }.png`) })
});

Then("点击{string}按钮", async function (btnName) {
    window.click(selectors[btnName]);
    await window.screenshot({ path: path.join(__dirname, '../testing-cache/screenshots', `点击${btnName}.png`) })
});

Then("点击{string}下拉按钮中的{string}", async function (btnName, itemName) {
    await window.click(selectors[`${btnName}下拉`]);
    await window.screenshot({ path: path.join(__dirname, '../testing-cache/screenshots', `点击${btnName}下拉列表-${itemName}下拉框完毕.png`) })
    await window.click(selectors[`${btnName}下拉列表-${itemName}`]);
    await window.screenshot({ path: path.join(__dirname, '../testing-cache/screenshots', `选择${btnName}下拉列表-${itemName}下拉框.png`) })
});

Then("保存为{string}", async function (fileName) {
    await model.getEdit("保存文件名").clearAll();
    await Keyboard.disableIme();
    await model.getEdit("保存文件名").pressKeys(path.join(__dirname, '../testing-cache', fileName), {onlyText: true});
    await model.getButton("保存").click();
    await Util.delay(2000);
});

Then("验证{string}文件存在", async function (fileName) {
    let fullname = path.join(__dirname, '../testing-cache', fileName);
    let isExist = fs.existsSync(fullname)
    assert.strictEqual(isExist, true, `未找到文件${fullname}`);
});

Then("打开项目{string}", async function (projectDir) {
    let title = await model.getPane("CukeTest窗口").property("title");
    await window.click(selectors["打开项目"]);
    let fullpath = path.join(__dirname, projectDir);
    await model.getEdit("打开文件夹").set(fullpath);
    await model.getButton("选择文件夹").click();
    await Util.delay(2000)
});

Then("打开文件{string}", async function (fileDir) {
    await window.click(selectors["打开"]);
    let fullpath = path.join(__dirname, fileDir);
    await model.getEdit("打开文件名").set(fullpath);
    try{
        await model.getButton("打开").click();
    }catch(e){}
    try{
        await model.getGeneric("带下拉框的打开").click();
    }catch(e){}
});

Then("等待运行结束", async function () {
    const ele = await window.$(selectors["停止运行"])    
    // 等待项目/剧本/脚本运行结束
    // 判断依据是“停止运行”按钮是否恢复
    while (true){
        if ((await ele.getAttribute("class")).match("disabled")){
            await Util.delay(500)
            if ((await ele.getAttribute("class")).match("disabled")) {
                break;
            }
        }
    }
});

Then("输出栏中出现运行结果包含下面内容", async function (docString) {
    let outputMessageBox = await window.$(selectors["输出栏"]);
    let outputMessage = await outputMessageBox.innerText();
    this.attach(outputMessage)
    assert.equal(outputMessage.indexOf(docString)>0, true, "项目未运行");
    
});

Given("点击一个元素", async function () {
    await window.click("li.edit_icon.hashover >> nth=3");
});

Given("打开帮助菜单", async function () {
    Keyboard.keyTap('f1');  // 此操作会打开新窗口
    let newWindow = await app.waitForEvent('window'); // 等待新窗口
    console.log(await newWindow.title());
    this.docWindow = newWindow;
});

Then("关闭帮助菜单", async function () {
    await this.docWindow.close();
});

Given("点击{string}按钮打开新窗口", async function (btnName) {
    await window.click(selectors[btnName]);    
    let newWindow = await app.waitForEvent('window'); // 等待新窗口
    console.log(await newWindow.title());
    this.newWindow = newWindow;
});

When("截图模型管理器", async function () {
    const mmWindow = this.newWindow;
    let screenshot = await mmWindow.screenshot({ path: path.join(__dirname, '../testing-cache/screenshots', `mm_helper.png`) });
    this.attach(screenshot, 'image/png')
});

Then("关闭模型管理器", async function () {
    const mmWindow = this.newWindow;
    await mmWindow.close();
});

function log(str) {
    console.log(str);
    this.attach(str);
}