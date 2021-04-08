const { QtModel, QtAuto} = require('leanpro.qt');
const { Given, When, Then } = require('cucumber');
const { Util } = require('leanpro.common');
const { BeforeAll, After } = require('cucumber');
const model = QtModel.loadModel(__dirname + "/model1.tmodel");

//// 你的步骤定义 /////

BeforeAll(async function () {
    QtAuto.launchQtProcess("/usr/lib/cuketest/bin/fetchmore"); // 前缀为CukeTest默认的sample路径
})

After(async function () {
    await Util.delay(2000);
    let screenshot = await model.getWindow("Fetch_More_Example").takeScreenshot();
    this.attach(screenshot, 'image/png')
})

When("搜索路径{string}", async function (dir) {
    await model.getEdit("Edit").set(dir);
});

Then("点击选项{string}", async function (fileName) {
    let listObject = model.getList("List");
    let targetItem;
    while(true) {
        if (targetItem = await listObject.findItem(fileName)) break;
        let count = await listObject.itemCount();
        await listObject.scrollToBottom(); //lazy load
        await Util.delay(1000);
        let newCount = await listObject.itemCount();
        if (newCount === count) break;
    }
    if (!targetItem) throw 'This item not found in list: ' + fileName;
    let index = await targetItem.itemIndex();
    await listObject.scrollTo(index);
    await listObject.select(index);
    await Util.delay(2000);
    let screenshot = await targetItem.takeScreenshot();
    this.attach(screenshot, 'image/png');
});

Then("点击第{int}个选项", async function (itemIndex) {
    let listObject = model.getList("List");
    let item = await listObject.getItem(itemIndex);
    await listObject.scrollTo(itemIndex);
    await item.click();
    await Util.delay(2000);
    let screenshot = await item.takeScreenshot();
    this.attach(screenshot, 'image/png');
});
Then("清除搜索路径", async function () {
    await model.getEdit("Edit").clearAll();
});

Given("操作对象为列表中的第{int}个选项", async function (itemIndex) {
    let targetItem = model.getList('List').getItem(itemIndex);
    this.targetItem = targetItem;
});

Then("跳转到目标选项位置", async function () {
    let targetItem = this.targetItem;
    await targetItem.scrollIntoView();
});

Then("点击目标选项", async function () {
    let targetItem = this.targetItem;
    await targetItem.select();
});
