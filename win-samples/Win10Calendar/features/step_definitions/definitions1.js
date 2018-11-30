
const { Given, When, Then } = require('cucumber');
const { TestModel } = require("leanpro.win");
const { Util } = require('leanpro.common')

const assert = require('assert')
const path = require('path');

const demofile = path.join(__dirname, '../../models/demo.tmodel')
const model = TestModel.loadModel(demofile);


Given(/^点击windows开始菜单$/, async function () {
    await model.getButton("开始").click(0, 0, 1);
    await Util.delay(2000);
});

When(/^点击日历控件$/, async function () {

    await model.getListItem("日历星期四7").click(0, 0, 1);
    await Util.delay(2000);
});

Then(/^应该打开日历应用$/, async function () {

    return true;
});

Given(/^在日期"([^"]*)"新添加事件$/, async function (arg1) {

    await model.getButton("2018年6月10日，没有事件").click(0, 0, 1);
    await Util.delay(2000);
});

When(/^事件名称中输入"([^"]*)"$/, async function (keys) {

    await model.getEdit("事件名称1").click(0, 0, 1);
    await model.getEdit("事件名称1").clearAll();
    await Util.delay(1000)

    await model.getEdit("事件名称1").pressKeys(keys);
    await Util.delay(1000)
});

When(/^地点中输入"([^"]*)"$/, async function (keys) {

    await Util.delay(1000);
    await model.getEdit("地点").click(0, 0, 1);
    await model.getEdit("地点").clearAll();
    await model.getEdit("地点").pressKeys(keys);
    await Util.delay(1000)

    await model.getEdit("事件名称1").click(0, 0, 1);
    await Util.delay(1000);
});

When(/^点击更多详情$/, async function () {

    await model.getButton("更多详细信息").click(0, 0, 1);
    await Util.delay(1000);
});

Then(/^应该跳转到详情页面$/, async function () {

    return '';
});

Given(/^事件名称输入"([^"]*)"$/, async function (keys) {

    await model.getEdit("事件名称2").click();
    await model.getEdit("事件名称2").click();
    await model.getEdit('事件名称2').clearAll();
    await model.getEdit("事件名称2").pressKeys(keys);
    await Util.delay(1000);
});

When(/^开始日期输入"([^"]*)"$/, async function (arg1) {

    await model.getComboBox("开始日期").click(0, 0, 1);

    await model.getButton("日期选取器").click(0, 0, 1);

    await Util.delay(2000);

    await model.getButton("2018年6月10日").click(0, 0, 1);

});

When(/^结束日期输入"([^"]*)"$/, async function (arg1) {

    await model.getButton("日期选取器1").click(0, 0, 1);
    await Util.delay(1000);
    await model.getButton("2018年6月10日").click(0, 0, 1);
});

When(/^事件详情中输入"([^"]*)"$/, async function (keys) {

    await model.getDocument("事件描述").clearAll();
    await Util.delay(3000);
    await model.getDocument("事件描述").click(0, 0, 1);
    await Util.delay(1000);
    await model.getDocument("事件描述").pressKeys(keys);
    await Util.delay(1000);
});

Given(/^点击保存并关闭按钮$/, async function () {

    await model.getButton("Save and close").click(0, 0, 1);
    await Util.delay(1000);
});

Then(/^日历视图中应该看到此事件"([^"]*)"$/, async function (arg1) {

    await Util.delay(2000);
    let exists = await model.getButton("Node.js Party; 2018年6月10日, All").exist(2);
    console.log("exit event:", exists)

    return assert.ok(exists)
});

Given(/^在此事件上面鼠标右键$/, async function () {
    await model.getButton("Node.js Party; 2018年6月10日, All").click(0, 0, 2);
});

When(/^选择删除按钮$/, async function () {
    await Util.delay(1000);
    await model.getButton("Delete").click(0, 0, 1);
    await Util.delay(1000);

});

Then(/^此事件应该被删掉$/, async function () {
    let exists = await model.getButton("Node.js Party; 2018年6月10日, All").exist(0);
    return assert.ok(!exists)
});

