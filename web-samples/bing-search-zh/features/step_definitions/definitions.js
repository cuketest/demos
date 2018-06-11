'use strict'
const { Given, When, Then } = require('cucumber');
const assert = require('assert');
const { driver } = require('../support/web_driver');

Given(/^浏览到网站 "([^"]*)"$/, async function(url) {
    return driver.get(url);
});

When(/^输入关键字 "([^"]*)"$/, async function (keyword) {
    return driver.findElement({ id: "sb_form_q" }).sendKeys(keyword);
});

Then(/^单击 “搜索” 按钮$/, async function () {
    return driver.findElement({ id: "sb_form_go" }).click();
});

Then(/^搜索结果应包含 "([^"]*)"$/, async function (keyword) {
    await driver.sleep(1000);
    let result = await driver.findElement({ id: "b_results" }).getText();
    return assert.ok(result.includes(keyword));
});