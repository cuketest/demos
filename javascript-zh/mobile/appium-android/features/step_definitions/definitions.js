const { Given, When, Then } = require('cucumber')
const assert = require('assert');
const { getDriver } = require('../support/get_driver');

//// 你的步骤定义 /////

Given("点击App跳转到App页面", async function () {
    let ele = await getDriver().$('//android.widget.TextView[@content-desc="App"]');
    this.attach(await ele.saveScreenshot("reports/App.png"), 'image/png');
    await ele.click();
});

When("在App页面中点击Action Bar", async function () {
    this.attach(await getDriver().$('android=new UiSelector().text("Action Bar").index(0)').saveScreenshot("reports/Action Bar.png"), 'image/png');
    await getDriver().$('android=new UiSelector().text("Action Bar").index(0)').click();
});

Then("页面应该跳转到Action Bar页面,页面中应该包含{string}", async function (text) {
    let texts = await getDriver().$('android=new UiSelector().textStartsWith("Action")').getText()
    let screenshot = await getDriver().$('android=new UiSelector().textStartsWith("Action")').saveScreenshot("reports/text.png");
    this.attach(screenshot, 'image/png');
    return assert.ok(texts.includes(text))
});