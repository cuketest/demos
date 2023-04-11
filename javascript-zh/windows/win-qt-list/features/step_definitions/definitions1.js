const { Keyboard } = require('leanpro.common');
const { CukeTest } = require('cuketest');
const { Given, When, Then, BeforeAll, AfterAll, setDefaultTimeout } = require('cucumber');
const { WinAuto } = require('leanpro.win');
const { Util } = require('leanpro.common');
const assert = require('assert');
let model = WinAuto.loadModel(__dirname + "/model1.tmodel");
setDefaultTimeout(60 * 1000); //set step timeout to be 30 seconds
let child;
BeforeAll(async function () {
    child = await Util.launchSample('fetchmore.exe'); 
    if (await model.getWindow("Window").exists(5)){
        Keyboard.disableIme(); // 禁用输入法
        await model.getWindow("Window").restore();
    }  
    else{
        throw new Error("Testing application was not launched.")
    }
    CukeTest.minimize();  // CukeTest最小化
})

AfterAll(async function () {
    await Util.stopProcess(child);  // 在调试时可以注释这一行观察结束后的现象
    CukeTest.restore();
})

//// 你的步骤定义 /////
Given("单击目标项{string}", async function (itemName) {
    let targetItem = await model.getListItem(itemName);
    await targetItem.click();
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
    await targetList.scrollToBottom();
    await Util.delay(1000);
    await targetList.scrollToTop();
});

When("在搜索框中输入路径{string}", async function (path) {
    let searchBox = model.getEdit("Directory:");
    await searchBox.set(path);
    assert.strictEqual(await searchBox.value(), path);
    await Util.delay(1000);
    
});

Then("判断搜索结果中是否存在目标项{string}",async function (itemName) {
    let targetItem = await model.getList('List').findItem(itemName);
    await targetItem.select();
    let actual = await targetItem.value();

    assert.strictEqual(actual, itemName);
    await Util.delay(3000);
});
