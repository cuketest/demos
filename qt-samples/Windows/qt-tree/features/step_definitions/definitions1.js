const { Given, When, Then } = require('cucumber');
const { AppModel, Auto } = require('leanpro.win');
let model = AppModel.loadModel(__dirname + "/model1.tmodel");
const { Util } = require('leanpro.common');
const assert = require('assert');
const path = require("path");
const { BeforeAll } = require('cucumber');
BeforeAll(async function () {
    Util.launchProcess("dirview.exe");
    await Util.delay(1000);
})

//// 你的步骤定义 /////

Given("点击模型中的树节点{string}", async function (treeItemName) {
    await model.getTreeItem(treeItemName).click(0, 0, 1);
});

Given("展开和折叠模型中的树节点{string}", async function (treeItemName) {
    await model.getTreeItem(treeItemName).expand();
    await Util.delay(2000);
    await model.getTreeItem(treeItemName).collapse();
});

Given("点击树中的{string}", async function (pathString) {
    let treepath = JSON.parse(pathString);
    await model.getTree("Tree").select(treepath);
});

Given("折叠与展开树中的{string}", async function (pathString) {
    let treepath = JSON.parse(pathString);
    console.log(treepath);
    console.log(await model.getTree("Tree").showHeader(3))
    await model.getTree("Tree").childCount(treepath);
    await model.getTree("Tree").collapseAll(treepath);
    
    // await Util.delay(2000);
    // console.log(await model.getTree("Tree").childCount([]));
    // await model.getTree("Tree").expandTo(treepath);
});

Given("访问并选中{string}文件", async function (relativePath) {
    let treepath = path.resolve(__dirname, '..', relativePath).split('\\');
    let tree = model.getTree('Tree');
    let foundFlag = false;
    // 由于磁盘名称不同这里为路径中的磁盘名做修改
    treepath[0] = treepath[0] == 'C:' ? 'Windows  (C:)' : treepath[0];
    this.item = await tree.select(treepath);
    this.treepath = treepath;
});

Then("{string}节点选中", async function (expectedItemName) {
    let itemName = await this.item.name();
    assert.strictEqual(itemName, expectedItemName);
    let selected = await this.item.focused();
    assert.strictEqual(selected, true);
});


