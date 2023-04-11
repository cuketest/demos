let { Given, When, Then } = require('cucumber')
let assert = require('assert')
let { driver } = require('../support/web_driver')

Given(/^打开百度首页"([^"]*)"$/, async function (arg1) {
    return driver.get(arg1)
});

When(/^在输入框中输入关键字"([^"]*)"$/, async function (arg1) {
    return driver.findElement({ id: "kw" }).sendKeys(arg1)
});

Then(/^点击搜索按钮$/, async function () {
    return driver.findElement({ id: "su" }).click()
});

Then(/^应该显示包含"([^"]*)"的搜索结果$/, async function (arg1) {
    await driver.sleep(1000)
    let result = await driver.findElement({ id: "content_left" }).getText();
    return assert.ok(result.includes(arg1))
});
