const { Keyboard } = require('leanpro.common');
const { Util } = require('leanpro.common');
const { QtAuto } = require('leanpro.qt');
const { Given, When, Then } = require('cucumber');
const { BeforeAll, After, AfterAll, setDefaultTimeout } = require('cucumber');
const { CukeTest } = require('cuketest');
const { join, dirname } = require('path');
const model = QtAuto.loadModel(__dirname + "/model1.tmodel");
const {RunSettings} = require('leanpro.common')
/// 超时时间和Hook设置 ///
setDefaultTimeout(60 * 1000);
let child;
BeforeAll(async function () {
    CukeTest.minimize();
    let sampleDir = dirname(process.execPath) // CukeTest默认的sample路径
    child = await QtAuto.launchQtProcessAsync([  // 针对系统不同传入多个启动路径，会自动选择可用的路径
        sampleDir + "/bin/fetchmore",
        sampleDir + "\\bin\\fetchmore.exe"
    ]); 
    await model.getApplication("fetchmore").exists(10);
});

After(async function () {
    await Util.delay(2000);
    let screenshot = await model.getWindow("Fetch_More_Example").takeScreenshot();
    this.attach(screenshot, 'image/png');
});

AfterAll(async function () {
    CukeTest.restore();
    CukeTest.maximize();
    await Util.stopProcess(child);
});

//// 你的步骤定义 /////

When("搜索CukeTest安装路径下的{string}", async function (dir) {
    let installPath = dirname(process.execPath);
    await model.getEdit("Edit").set(join(installPath, dir));
});

Then("点击选项{string}", async function (fileName) {
    let listObject = model.getList("List");
    let targetItem;
    while (true) {
        if (targetItem = await listObject.findItem(fileName)) break;
        let count = await listObject.itemCount();
        await listObject.scrollToBottom(); //加载延迟加载的选项
        await Util.delay(1000);
        let newCount = await listObject.itemCount();
        if (newCount === count) break;  // 滚动到底部没有加载新的选项即到达底部
    }
    if (!targetItem) throw 'object not found: ' + fileName;
    let index = await targetItem.itemIndex();
    await listObject.scrollTo(index);
    RunSettings.slowMo = 0
    let item = await listObject.getItem(index);
    await item.select();
    await item.highlight();
});

Then("点击第{int}个选项", async function (itemIndex) {
    let listObject = model.getList("List");
    await listObject.scrollTo(itemIndex);
    let item = await listObject.getItem(itemIndex);
    await item.select();
    await item.highlight()
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
    await targetItem.highlight();
});
