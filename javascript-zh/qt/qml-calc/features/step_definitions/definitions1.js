const assert = require('assert');
const { AfterAll } = require('cucumber');
const { Util } = require('leanpro.common');
const { setDefaultTimeout } = require('cucumber');
const { BeforeAll } = require('cucumber');
const { RunSettings } = require("leanpro.common");
const { QtAuto } = require("leanpro.qt");

const { Given, When, Then } = require('cucumber');

// 指定自动化操作方法调用之间的最小间隔时间为500毫秒，用于减慢自动化速度，且在输出面板中输出每个自动化操作的报告信息
RunSettings.set({ slowMo: 500, reportSteps: true });

// 加载Qt应用程序的UI模型文件
let modelQt = QtAuto.loadModel(__dirname + "/recording_1.tmodel");

// 设置步骤的超时时间为60秒
setDefaultTimeout(60 * 1000);

let proc;

// 在所有测试场景执行之前准备测试环境，启动被测应用并等待其出现。 
BeforeAll(async function () {
    //启动Qt应用"calculator-qml"
    proc = await QtAuto.launchQtProcessAsync(process.cwd() + "/samples/calculator-qml.exe");
    await modelQt.getApplication("calculator-qml").exists(10);
})

// 在所有测试场景执行结束后，关闭被测应用。
AfterAll(async function () {
    Util.stopProcess(proc);
})

//// 你的步骤定义 /////

Given("开始计算", async function () {
    await modelQt.getQuick("C").click();
});

When("设置操作符{string}", async function (arg1) {
    return modelQt.getQuick(arg1).click();
});

When("点击操作{string}", async function (arg1) {
    return modelQt.getQuick(arg1).click();
});

When("设置被操作符{string}", async function (arg1) {
    return modelQt.getQuick(arg1).click();
});

Then("结果应该等于{string}", async function (arg1) {
    await modelQt.getQuick("=").click();
    const value = await modelQt.getQuick("ret").property("text");

    // 高亮之后截图，将截图添加到报告中
    await modelQt.getQuick("ret").highlight();
    this.attach(await modelQt.getQuick("QQuickRectangle").takeScreenshot(), 'image/png');
    
    // 断言结果是否一致
    assert.equal(value, arg1);
});