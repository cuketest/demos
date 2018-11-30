'use strict'
const { Given, When, Then } = require('cucumber');
const assert = require('assert');
const { driver } = require('../support/web_driver');
const { until } = require('selenium-webdriver') 

Given(/^浏览到网站 "([^"]*)"$/, async function(url) {
    return driver.get(url);
});

When(/^输入关键字 "([^"]*)"$/, async function (keyword) {
    return driver.findElement({ id: "sb_form_q" }).sendKeys(keyword);
});

Then(/^单击 “搜索” 按钮$/, async function () {

    let searchBtn = driver.wait( until.elementIsEnabled(driver.findElement({ id: "sb_form_go"})),10*1000)
    await searchBtn.click();


});

Then(/^搜索结果应包含 "([^"]*)"$/, async function (keyword) {
    let result = driver.wait(until.elementLocated({ id:'b_results'}),10*1000)
    let content = await result.getText();
    return assert.ok(content.includes(keyword));
});