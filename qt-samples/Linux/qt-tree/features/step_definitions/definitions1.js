const { Given, When, Then } = require('cucumber');
const { Before, After, AfterAll, BeforeAll } = require('cucumber');
const { QtModel,QtAuto } = require('leanpro.qt');
const { Util } = require('leanpro.common');
const cuketest = require('cuketest');
const path = require("path");
const assert = require('assert');
let model = QtModel.loadModel(__dirname + "/model.tmodel");

Before(async function (testCase) {
    // await Util.delay(2000);
})
BeforeAll(async function () {
    cuketest.minimize();
    QtAuto.launchQtProcess("/usr/lib/cuketest/bin/dirview");
})
After(async function () {
    await Util.delay(2000);
})
AfterAll(async function () {
    cuketest.restore();
    cuketest.maximize();
})

//// 你的步骤定义 /////
// 将路径拆分成路径节点数组
function genAbsPath(relativePath){
    let absPath = '';
    if(!path.isAbsolute(relativePath)){
        absPath = path.join(__dirname, '..', relativePath);
    }else{
        absPath = relativePath;
    }
    let pathNodes = absPath.split(path.sep);
    pathNodes.shift();
    pathNodes.unshift('/');
    return pathNodes;
}


Given("在模型管理器中添加识别了目标树节点", async function () {
    // 将模型管理器中识别到的节点名称赋值给nodeName变量
    let nodeName = "mail"
    this.item = model.getTreeItem(nodeName);
});

Given("展开并滚动到目标树节点", async function () {
    let targetItem = this.item;
    await targetItem.scrollIntoView();
    await Util.delay(500);
});

When("展开目标树节点自身", async function () {
    let targetItem = this.item;
    let isExpandable = await targetItem.expandable();
    if (!isExpandable) {
        throw `目标节点无法展开，因为是文件`
    } else {
        await targetItem.expand();
    }
    await Util.delay(500);
});

Given("展开{string}文件所在树节点", async function (relativePath) {

    let dirNamePath = genAbsPath(relativePath);
    console.log(dirNamePath)
    let tree = model.getTree('Dir_View');
    let targetItem = tree;
    for (let i = 0; i < dirNamePath.length; i++) {
        targetItem = await targetItem.findItem(dirNamePath[i]);
        if(!targetItem){
            throw `Can not find the Item named ${dirNamePath[i]}.`
        }
        await targetItem.expand();
        await Util.delay(200);
        await targetItem.scrollIntoView();
    }
    this.item = targetItem; // 在场景中传递TreeItem对象
});

Then("选中目标树节点并验证", async function () {
    let targetItem = this.item;
    // 如果目标不在可点击区域内则会展开到该节点位置
    await targetItem.scrollIntoView();
    await targetItem.expand();
    let isChecked = await targetItem.expanded();
    assert.equal(isChecked, true, "没有选中目标树节点");
});

Then("将目标树节点展开到可视范围内", async function () {
    let targetItem = this.item;
    await targetItem.scrollIntoView();
});

Given("目标树节点的itemPath为{string}，获取该树节点的对象", async function (itemPathString) {
    let itemPath = JSON.parse(itemPathString);
    console.log("itemPath:", itemPath);
    let targetItem = model.getTree("Dir_View").getItem(itemPath);
    if (!targetItem) {
        throw "target TreeItem is not exist in this itemPath " + itemPathString;
    }
    this.item = targetItem;
});

Then("应用截图", async function () {
    let screenshot = await model.getTree("Dir_View").takeScreenshot();
    this.attach(screenshot, 'image/png')
});
