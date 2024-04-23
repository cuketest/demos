const { Given, When, Then, BeforeAll, After, AfterAll, setDefaultTimeout } = require('cucumber');
const assert = require('assert');
const { createDriver, getDriver } = require('../support/get_driver');

// 设置步骤的超时时间为60秒
setDefaultTimeout(60 * 1000);

// 在所有测试场景执行之前准备测试环境，连接Appium Server
BeforeAll(async function () {
    await createDriver();
})

// 在每个测试场景执行之后捕获当前窗口的屏幕截图并附加到测试报告。
After(async function () {
    let screenshot = await getDriver().saveScreenshot("reports/screenShot.png");
    this.attach(screenshot, 'image/png');
})

// 在所有测试场景执行结束后，关闭会话。
AfterAll(async function () {
    await getDriver().deleteSession();
})

//// 你的步骤定义 /////
Given("点击App跳转到App页面", async function () {
    // 查找 "App" 元素
    let ele = await getDriver().$("accessibility id:App");
    // 捕获并附加 App 页面的屏幕截图到测试报告
    this.attach(await ele.saveScreenshot("reports/App.png"), 'image/png');
    // 点击 "App" 元素
    await ele.click();
});

When("在App页面中点击Action Bar", async function () {
    // 查找 "Action Bar" 元素
    let actionBar = await getDriver().$("accessibility id:Action Bar");
    // 捕获并附加 Action Bar 页面的屏幕截图到测试报告
    this.attach(await actionBar.saveScreenshot("reports/Action Bar.png"), 'image/png');
    // 点击 "Action Bar" 元素
    await actionBar.click();
});

Then("页面应该跳转到Action Bar页面,页面中应该包含{string}", async function (text) {
    // 查找包含指定文本的元素
    let target = await getDriver().$('android=new UiSelector().textStartsWith("Action")');
    // 获取元素的文本内容
    let texts = await target.getText();
    // 捕获并附加找到元素文本内容和屏幕截图到测试报告
    this.attach(`查找到的文本为：${texts}`)
    this.attach(await target.saveScreenshot("reports/text.png"), 'image/png');

    // 验证找到的文本中是否包含给定的文本
    return assert.ok(texts.includes(text))
});