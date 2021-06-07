const cuketest = require('cuketest');
const { Given, When, Then } = require('cucumber');
const { BeforeAll, AfterAll } = require('cucumber');
const { AppModel, Auto } = require('leanpro.win');
const { Util } = require('leanpro.common');
const assert = require('assert');
const path = require('path');
let model = AppModel.loadModel(__dirname + "/model1.tmodel");
let pid = 0;
BeforeAll(async function () {
    pid = await Util.launchProcess('./features/fetchmore.exe'); 
    if (await model.getWindow("Window").exists(5)){
        await model.getWindow("Window").restore();
    }  
    else{
        throw new Error("Testing application was not launched.")
    }
    cuketest.minimize();  // CukeTest最小化
})

AfterAll(async function () {
    // await Util.stopProcess(pid);  // 在调试时可以注释这一行观察结束后的现象
    // cuketest.restore();
})

//// 你的步骤定义 /////
Given("单击目标项{string}", async function (itemName) {
    let targetItem = await model.getListItem(itemName);
    await targetItem.click(1, 1, 1);
    await Util.delay(500);
    let isFocused = await targetItem.focused();
    assert.strictEqual(isFocused, true, `Target item ${itemName} is not selected!`);
});

Given("选中目标项{string}", async function (itemName) {
    let targetItem = await model.getListItem(itemName);
    await targetItem.select(); 
    await Util.delay(500);
    let isFocused = await targetItem.focused();
    assert.strictEqual(isFocused, true, `Target item ${itemName} is not selected!`);
});

Given("使用列表方法进行滚动", async function () {
    let targetList = model.getList("List");
    let count = await targetList.itemCount();
    await targetList.scrollToBottom();
    await Util.delay(1000);
    await targetList.scrollTo(count);
    await Util.delay(1000);
    await targetList.scrollToTop();
    await Util.delay(1000);
});
When("使用滚动条按钮进行翻页", async function () {
    // 在模型文件中添加滚动条的测试对象
    let lineUp = model.getButton("Line up");
    let lineDown = model.getButton('Line down')
    let pageUp = model.getButton('Page up');
    let pageDown = model.getButton('Page down');

    await lineDown.click();
    await Util.delay(1000);
    await pageDown.click();
    await Util.delay(1000);
    await lineUp.click();
    await Util.delay(1000);
    await pageUp.click();
    await Util.delay(1000);
});
When("使用滚动条的方法进行滚动和翻页", async function () {
    let scrollbar = model.getScrollBar('ScrollBar');
    await scrollbar.lineDown()
    await Util.delay(1000);
    await scrollbar.lineUp();
    await Util.delay(1000);
    await scrollbar.pageDown();
    await Util.delay(1000);
    await scrollbar.pageUp();
    await Util.delay(1000);
});

When("在搜索框中输入路径{string}", async function (path) {
    let searchBox = model.getEdit("Directory:");
    await searchBox.set(path);
    assert.equal(await searchBox.value(), path);
    await Util.delay(1000);
    
});

Then("判断搜索结果中是否存在目标项{string}",async function (itemName) {
    let targetItem = await model.getList('List').findItem(itemName);
    await targetItem.select();
    let actual = await targetItem.value();

    assert.strictEqual(actual, itemName);
    await Util.delay(3000);
});
