const { BeforeAll, AfterAll, setDefaultTimeout } = require('cucumber');
const { Given, When, Then } = require('cucumber');
const { CukeTest } = require("cuketest");
const path = require('path');

let QtAuto, modelQt;

// 设置步骤的超时时间为60秒
setDefaultTimeout(60 * 1000);

// 在所有测试场景执行之前,连接到远程地址，启动被测应用。
BeforeAll(async function () {

    // 获取运行配置信息，可在运行配置中指定ip地址
    const info = await CukeTest.info()
    const ip = info.profile && info.profile.custom // 如果没有指定IP则使用主机运行
        ? info.profile.custom
        : "localhost";
    let auto = await CukeTest.connect({
        wsEndpoint: `ws://${ip}:3131/ws`
    });

    QtAuto = auto.qtAuto;
    const { runSettings: RunSettings } = auto;

    // 设置每个操作间隔0.5秒
    await RunSettings.set({ slowMo: 500 });

    let capabilities = await auto.capabilities();
    let homeDir = capabilities.homePath;

    // 针对系统不同传入多个启动路径，会自动选择可用的路径
    let qtAppPath = [  
        // Linux
        `${homeDir}/bin/validators`, 
        // Windows
        `${homeDir}\\bin\\validators.exe`, 
        // Mac
        '/Applications/CukeTest.app/Contents/Frameworks/validators', 
    ]

    // Launch Qt application "validators"
    await QtAuto.launchQtProcessAsync(qtAppPath);

    // 加载Qt应用的UI模型文件
    modelQt = await QtAuto.loadModel(__dirname + "/model.tmodel");
    await modelQt.getApplication("validators").exists(10);

})

// 在所有测试场景执行结束后，关闭被测应用。
AfterAll(async function () {
    // Click "pushButton"
    await modelQt.getButton("pushButton").click();
    // Quit Qt application "validators"
    await modelQt.getApplication("validators").quit();
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量country
When("选择国家{string}", async function (country) {
    // ComboBox不用select方法选择的work around
    await modelQt.getComboBox("localeSelector").click();
    let item = await modelQt.getList("List").findItem(country);
    await item.click();
    // await modelQt.getComboBox("localeSelector").select(country);
});

// {int} 占位符接收一个整数类型参数，字符串传递给变量input
When("输入数字{int}", async function (input) {
    await modelQt.getSpinBox("minVal").click();
    await modelQt.getSpinBox("minVal").set(`${input}`);
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量expected
Then("实际结果为{string}", async function (expected) {

    // 检查value属性是否符合预期的值，不符合时将显示指定的消息。
    let minVal = await modelQt.getSpinBox("minVal");
    await minVal.checkProperty("value", expected, "实际结果与预期值不符");
});

// {int} 占位符接收一个整数类型参数，字符串传递给变量input
When("输入最小值{int}", async function (input) {
    await modelQt.getSpinBox("minVal").click();
    await modelQt.getSpinBox("minVal").set(`${input}`);
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量expected
Then("最小结果应该为{string}", async function (expected) {

    // 检查value属性是否符合预期的值，不符合时将显示指定的消息。
    let minVal = await modelQt.getSpinBox("minVal");
    await minVal.checkProperty("value", expected, "最小结果与预期值不符");
});

// {int} 占位符接收一个整数类型参数，字符串传递给变量input
When("输入最大值{int}", async function (input) {
    await modelQt.getSpinBox("maxVal").click();
    await modelQt.getSpinBox("maxVal").set(`${input}`);
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量expected
Then("最大结果应该为{string}", async function (expected) {
    let maxVal = await modelQt.getSpinBox("maxVal");

    // 检查value属性是否符合预期的值，不符合时将显示指定的消息。
    await maxVal.checkProperty("value", expected, "最大结果与预期不符");
});

