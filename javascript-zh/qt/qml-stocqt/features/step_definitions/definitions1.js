const { Given, When, Then, AfterAll, BeforeAll, setDefaultTimeout } = require('cucumber');
const { QtAuto } = require('leanpro.qt');
const { RunSettings } = require("leanpro.common");

// 设置步骤的超时时间为60秒
setDefaultTimeout(60 * 1000);

// 指定自动化操作方法调用之间的最小间隔时间为500毫秒，用于减慢自动化速度，且在输出面板中输出每个自动化操作的报告信息
RunSettings.set({ slowMo: 500, reportSteps: true });

// 加载Qt应用的UI模型文件
let modelQt = QtAuto.loadModel(__dirname + "/model1.tmodel");

// 在所有测试场景执行之前准备测试环境，启动被测应用并等待其出现。
BeforeAll(async function () {
    await QtAuto.launchQtProcessAsync("D:\\stocqt\\stocqt.exe");
    await modelQt.getApplication("stocqt").exists(30);
})

// 在所有测试场景执行结束后，关闭被测应用。
AfterAll(async function () {
    await modelQt.getApplication("stocqt").quit();
})

When("在股票列表中选择 AAPL", async function () {
    // 点击 "QQuickRectangle"
    await modelQt.getQuick("QQuickRectangle").click();
});

Then("应该看到股票代码、公司名称、当前价格和价格变动", async function () {

    // 检查目标项的属性是否符合预期的值
    await modelQt.getQuick("stockIdText").checkProperty("text", "AAPL");
    await modelQt.getQuick("price").checkProperty("text", "169.23");
    await modelQt.getQuick("stockNameText").checkProperty("text", "Apple Inc.");
    await modelQt.getQuick("priceChange").checkProperty("text", "-1.85");
    await modelQt.getQuick("priceChangePercentage").checkProperty("text", "(-1.08%)");
});

When("切换行情视图为近六月", async function () {
    await modelQt.getQuick("halfYearlyButton").click();
});

When("勾选了开盘价和收盘价", async function () {
    await modelQt.getQuick("openButton").click();
    await modelQt.getQuick("closeButton").click();
});

Then("相应的行情图表应该根据选中的时间范围和图例更新", async function () {

    // 应用窗口截屏并添加到报告中
    let stockChart = await modelQt.getQuick("stockView").takeScreenshot();
    this.attach(stockChart, "image/png");
});

Then("回到股票列表", async function () {
    await modelQt.getQuick("arrow").click();
});
