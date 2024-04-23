const assert = require('assert');
const { AfterAll, BeforeAll, Given, When, Then, setDefaultTimeout } = require('cucumber');
const { AtkAuto } = require('leanpro.atk');
const { Util, Keyboard } = require('leanpro.common');
const { platform } = require('os');

// 设置步骤的超时时间为60秒
setDefaultTimeout(60 * 1000);

// 加载Atk应用程序的UI模型文件
let model = AtkAuto.loadModel(__dirname + "/model1.tmodel");
let pid = 0;

//// 你的步骤定义 /////

// 在所有测试场景之前执行，验证当前系统是否为Linux。 
BeforeAll(async function () {
    if (platform() == "win32") {
        console.log("当前系统不是Linux，无法进行GTK自动化");
        return "skipped"
    }
})

// 在所有测试场景执行结束后，关闭被测应用。
AfterAll(async function () {
    Util.stopProcess(pid);
})

Given("打开应用", async function () {

    // 启动进程
    pid = await Util.launchProcess('/usr/lib/cuketest/bin/gtk3-icon-browser');
});

When("最大化应用窗口", async function () {

    // 如果最大化按钮存在则点击按钮，否则用快捷键最大化窗口
    if (await model.getButton("最大化").exists(5)) {
        await model.getButton("最大化").click();
    } else {
        Keyboard.keyDown("command");
        Keyboard.keyTap("up");
        Keyboard.keyUp("command");
    }

    // 将 "Icon_Browser" 控件的屏幕截图附加到测试报告中
    this.attach(await model.getGeneric("Icon_Browser").takeScreenshot(), 'image/png');
});

Given("打开搜索栏", async function () {
    await model.getButton("Button").click();
    // 延迟1秒，等待打开完成
    await Util.delay(1000);
});

When("搜索名字包含{string}的图标", async function (keywords) {
    await model.getEdit("搜索").set(keywords);
});

Then("切换图标风格", async function () {
    await model.getGeneric("Symbolic").click();
});

Then("验证搜索结果", async function () {

    // 控件截图并添加到测试报告
    const sc = await model.getGeneric("Pane3").takeScreenshot();
    this.attach(sc, 'image/png');
});

Given("获取列表中的所有内容", async function () {
    
    // 获取列表中的数据，将数据转换为 JSON 字符串并附加到测试报告中
    const data = await model.getGeneric("List").data();
    this.attach(JSON.stringify(data), 'application/json');
});

When("选中第{int}项并验证选中情况", async function (index) {
    await model.getGeneric("List").select(index);

    this.attach(await model.getGeneric("List").takeScreenshot(), 'image/png');
});