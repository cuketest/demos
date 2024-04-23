const assert = require('assert');
const fs = require('fs');
const path = require('path');

const { Keyboard, Util } = require('leanpro.common');
const { _electron } = require('leanpro.web');
const { WinAuto } = require("leanpro.win");
const { CukeTest } = require('cuketest');
const { BeforeAll, AfterAll, Given, When, Then, setDefaultTimeout } = require('cucumber');

const selectors = require('./selectors.json');

// 清除默认超时
setDefaultTimeout(-1);

// 加载Windows应用的UI模型文件
let model = WinAuto.loadModel(".\\features\\main.tmodel");
let app, window;

// 在所有测试场景执行之前准备测试环境
BeforeAll(async function () {

    // 最小化CukeTest窗口以避免与UI测试干扰。
    CukeTest.minimize();

    // 尝试删除测试缓存目录，如果不存在则忽略
    try {
        fs.rmdirSync(path.join(__dirname, '../testing-cache'), { recursive: true});
    } catch(e) {} finally {

        // 确保创建测试缓存目录及其子目录
        fs.mkdirSync(path.join(__dirname, '../testing-cache'));
        fs.mkdirSync(path.join(__dirname, '../testing-cache/screenshots'));
    }

    // 启动 Electron 应用程序
    app = await _electron.launch({
        executablePath: process.execPath, // 使用当前执行路径作为可执行文件路径
        args: ['--no-qt', "--no-detach"]
    });

    // 获取应用程序的上下文
    let context = await app.context();

    // 设置默认超时时间为 10000 毫秒（10秒）
    context.setDefaultTimeout(10000);

    // 获取第一个窗口
    window = await app.firstWindow();

    // 等待选择器为 "打开" 的元素出现
    await window.waitForSelector(selectors["打开"]);

    // 键盘按下 Ctrl+0 键
    await Keyboard.pressKeys("^0");
});

// 在所有测试场景执行结束后，关闭被测应用，CukeTest窗口最大化
AfterAll(async function () {
    await window.close();
    CukeTest.maximize();
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量imgName
Then("截图为{string}", async function (imgName) {

    // 截图存放到指定路径
    await window.screenshot({ path: path.join(__dirname, '../testing-cache/screenshots', `${imgName }.png`) });
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量btnName
Then("点击{string}按钮", async function (btnName) {
    window.click(selectors[btnName]);
    await window.screenshot({ path: path.join(__dirname, '../testing-cache/screenshots', `点击${btnName}.png`) });
});

// {string} 占位符接收一个字符串类型参数，两个字符串分别传递给变量btnName和itemName
Then("点击{string}下拉按钮中的{string}", async function (btnName, itemName) {
    await window.click(selectors[`${btnName}下拉`]);
    await window.screenshot({ path: path.join(__dirname, '../testing-cache/screenshots', `点击${btnName}下拉列表-${itemName}下拉框完毕.png`) });
    await window.click(selectors[`${btnName}下拉列表-${itemName}`]);
    await window.screenshot({ path: path.join(__dirname, '../testing-cache/screenshots', `选择${btnName}下拉列表-${itemName}下拉框.png`) });
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量fileName
Then("保存为{string}", async function (fileName) {
    await model.getEdit("保存文件名").clearAll();

    // 禁用输入法，防止键盘操作出现中文
    await Keyboard.disableIme();
    await model.getEdit("保存文件名").pressKeys(path.join(__dirname, '../testing-cache', fileName), {onlyText: true});
    await model.getButton("保存").click();
    await Util.delay(2000);
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量fileName
Then("验证{string}文件存在", async function (fileName) {
    let fullname = path.join(__dirname, '../testing-cache', fileName);
    
    // 检查文件是否存在
    let isExist = fs.existsSync(fullname)
    assert.strictEqual(isExist, true, `未找到文件${fullname}`);
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量projectDir
Then("打开项目{string}", async function (projectDir) {
    let title = await model.getPane("CukeTest窗口").property("title");
    await window.click(selectors["打开项目"]);

    // 输入项目路径
    let fullpath = path.join(__dirname, projectDir);
    await model.getEdit("打开文件夹").set(fullpath);
    await model.getButton("选择文件夹").click();
    await Util.delay(2000);
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量fileDir
Then("打开文件{string}", async function (fileDir) {
    await window.click(selectors["打开"]);

    // 输入文件路径
    let fullpath = path.join(__dirname, fileDir);
    await model.getEdit("打开文件名").set(fullpath);

    // 处理按钮可能不同的情况
    try{
        await model.getButton("打开").click();
    }catch(e){}
    try{
        await model.getGeneric("带下拉框的打开").click();
    }catch(e){}
    await Util.delay(1000);
});

Then("等待运行结束", async function () {
    const ele = await window.$(selectors["停止运行"]);
    // 等待项目/剧本/脚本运行结束
    // 判断依据是“停止运行”按钮是否恢复
    while (true){
        if ((await ele.getAttribute("class")).match("disabled")){
            await Util.delay(500);
            if ((await ele.getAttribute("class")).match("disabled")) {
                break;
            }
        }
    }
});

Then("输出栏中出现运行结果包含下面内容", async function (docString) {

    // 获取输出栏的文本内容，添加到报告中方便查看
    let outputMessageBox = await window.$(selectors["输出栏"]);
    let outputMessage = await outputMessageBox.innerText();
    this.attach(outputMessage);

    // 通过判断输出栏中是否输出指定定容来校验项目是否运行
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
    this.attach(screenshot, 'image/png');
});

Then("关闭模型管理器", async function () {
    const mmWindow = this.newWindow;
    await mmWindow.close();
});

function log(str) {
    console.log(str);
    this.attach(str);
}