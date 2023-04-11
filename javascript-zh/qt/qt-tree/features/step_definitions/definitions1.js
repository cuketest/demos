const { Given, When, Then } = require('cucumber');
const { After, AfterAll, BeforeAll, setDefaultTimeout } = require('cucumber');
const { QtAuto } = require('leanpro.qt');
const { Util } = require('leanpro.common');
const { CukeTest } = require('cuketest');
const path = require("path");
const assert = require('assert');
let model = QtAuto.loadModel(__dirname + "/model.tmodel");

/// 超时时间和Hook设置 ///
setDefaultTimeout(60 * 1000);  //set step timeout to be 60 seconds
let child;
BeforeAll(async function () {
    CukeTest.minimize();
    
    let sampleDir = path.dirname(process.execPath) // CukeTest默认的sample路径
    child = await QtAuto.launchQtProcessAsync([  // 针对系统不同传入多个启动路径，会自动选择可用的路径
        sampleDir + "/bin/dirview",
        sampleDir + "\\bin\\dirview.exe"
    ]); 
    await model.getApplication("dirview").exists(10);
})

After(async function () {
    let screenshot = await model.getTree("Dir_View").takeScreenshot();
    this.attach(screenshot, 'image/png');
    await Util.delay(2000);
})

AfterAll(async function () {
    CukeTest.restore();
    CukeTest.maximize();
    Util.stopProcess(child)
})

//// 你的步骤定义 /////

Given("展开到{string}文件所在树节点", async function (relativePath) {

    // 将路径拆分成路径节点数组
    let dirNamePath = path.resolve(__dirname, '..', relativePath).split(path.sep);
    this.attach(`pathNodes: [${dirNamePath}]`);
    let tree = model.getTree('Dir_View');
    let targetItem;

    // 由于路径根节点需要特殊处理
    // Windows系统中为磁盘名+磁盘符
    // Linux系统中为`/`，在pathNodes中表现为空字符''
    let root = dirNamePath[0];
    if (root === '') {
        targetItem = await tree.findItem('/');
    } else {
        let rootNodeList = await tree.children();
        await Promise.all(rootNodeList.map(async node => {
            let nodeName = await node.value();
            if (nodeName.indexOf(root) !== -1) {
                targetItem = node;
            }
        }));
    }
    dirNamePath[0] = await targetItem.value();
    await tree.scrollTo(dirNamePath);
    this.dirNamePath = dirNamePath;
});

Then("选中目标树节点并验证", async function () {
    let targetItem = await model.getTree('Dir_View').getItem(this.dirNamePath);
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
    let targetItem = model.getTree("Dir_View").getItem(itemPath);
    if (!targetItem) {
        throw "target TreeItem is not exist in this itemPath " + itemPathString;
    }
    this.dirNamePath = itemPath;
    this.item = targetItem;
});

Then("应用截图", async function () {
    let screenshot = await model.getTree("Dir_View").takeScreenshot();
    this.attach(screenshot, 'image/png');
});
