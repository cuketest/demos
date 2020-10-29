'use strict'
const { Given, When, Then } = require('cucumber');
const assert = require('assert');
const { driver } = require('../support/web_driver');
const { until, Key } = require('selenium-webdriver') 

Given("浏览到网站 {string}", async function(url) {
    return driver.get(url);
});

When("输入关键字 {string}并搜索", async function (keyword) {
    return driver.findElement({ id: "sb_form_q" }).sendKeys(keyword,Key.ENTER);
});

Then("单击 “搜索” 按钮", async function () {
    // 由于Bing搜索界面修改而弃用的方案
    // let searchBtn = driver.wait( until.elementIsEnabled(driver.findElement({ id: "sb_form_go"})),10*1000)
    // await searchBtn.click();
});

Then("搜索结果应包含 {string}", async function (keyword) {
    let result = driver.wait(until.elementLocated({ id:'b_results'}),10*1000)
    let content = await result.getText();
    return assert.ok(content.includes(keyword));
});