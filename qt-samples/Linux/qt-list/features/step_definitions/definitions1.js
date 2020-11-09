const { QtModel } = require('leanpro.qt');
const { Given, When, Then } = require('cucumber');
const model = QtModel.loadModel(__dirname + "/model1.tmodel");

//// 你的步骤定义 /////


When("搜索路径{string}", async function (dir) {
    await model.getEdit("Edit").set(dir);
});

Then("点击选项{string}", async function (fileName) {
    let listObject = model.getList("List");
    let targetItem = await listObject.findItem(fileName);
    let index = await targetItem.itemIndex();
    await listObject.scrollTo(index);
    await listObject.select(index);
});

Then("点击第{int}个选项", async function (itemIndex) {
    let listObject = model.getList("List");
    await listObject.scrollTo(itemIndex);
    await listObject.select(itemIndex);
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
