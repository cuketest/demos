const { Keyboard } = require('leanpro.common');
const { CukeTest } = require('cuketest');
const { Given, When, Then, BeforeAll, AfterAll, After, setDefaultTimeout } = require('cucumber');
const { WinAuto } = require('leanpro.win');
const { Util } = require('leanpro.common');

// 加载Windows应用的UI模型文件
let model = WinAuto.loadModel(__dirname + "/model1.tmodel");

// 设置步骤的超时时间为60秒
setDefaultTimeout(60 * 1000);

let child;

// 在所有测试场景执行之前准备测试环境，启动被测应用并等待其出现。
BeforeAll(async function () {
    child = await Util.launchSample('fetchmore.exe');

    // 检查测试窗口是否存在，并恢复窗口状态，禁用输入法以避免测试过程中的干扰
    if (await model.getWindow("Window").exists(5)) {
        // 禁用输入法
        Keyboard.disableIme(); 
        await model.getWindow("Window").restore();
    }
    else {
        throw new Error("Testing application was not launched.");
    }

    // 最小化CukeTest窗口以避免与UI测试干扰。
    CukeTest.minimize(); 
})

// 在每个测试场景执行之后捕获当前窗口的屏幕截图并附加到测试报告。
After(async function () {
    let screenshot = await model.getWindow("Window").takeScreenshot();
    this.attach(screenshot, 'image/png');
})

// 在所有测试场景执行结束后，关闭被测应用。
AfterAll(async function () {
    await Util.stopProcess(child);  // 在调试时可以注释这一行观察结束后的现象

    // 恢复CukeTest窗口状态
    CukeTest.restore();
})

//// 你的步骤定义 /////
Given("单击目标项{string}", async function (itemName) {
    let targetItem = await model.getListItem(itemName);
    await targetItem.click();

    // 等待500毫秒以确保操作完成
    await Util.delay(500);

    // 检查目标项是否被成功选中，如果没有被选中，则将显示指定的消息
    await targetItem.checkProperty('focused', true, `Target item ${itemName} is not selected!`);
});

Given("选中目标项{string}", async function (itemName) {
    let targetItem = await model.getListItem(itemName);
    await targetItem.select();
    
    // 等待500毫秒以确保操作完成
    await Util.delay(500);

    // 检查目标项是否被成功选中，如果没有被选中，则将显示指定的消息
    await targetItem.checkProperty('focused', true, `Target item ${itemName} is not selected!`);
});

Given("使用列表方法进行滚动", async function () {
    let targetList = model.getList("List");

    // 滚动到列表底部
    await targetList.scrollToBottom();

    // 等待1000毫秒以确保滚动完成
    await Util.delay(1000);

    // 滚动到列表顶部
    await targetList.scrollToTop();
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量path
When("在搜索框中输入路径{string}", async function (path) {
    let searchBox = model.getEdit("Directory:");

    // 设置搜索框的值
    await searchBox.set(path);

    // 检查搜索框的值是否设置成功
    await searchBox.checkProperty('value', path);

});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量itemName
Then("判断搜索结果中是否存在目标项{string}", async function (itemName) {
    let targetItem = await model.getList('List').findItem(itemName);

    // 选中目标项
    await targetItem.select();

    // 检查目标项的值是否正确
    await targetItem.checkProperty('value', itemName);
});
