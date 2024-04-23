const { Given, When, Then } = require('cucumber');
const { After, AfterAll, BeforeAll, setDefaultTimeout } = require('cucumber');
const { QtAuto } = require('leanpro.qt');
const { Util } = require('leanpro.common');
const { CukeTest } = require('cuketest');
const path = require("path");

// 加载Qt应用程序的UI模型文件
let model = QtAuto.loadModel(__dirname + "/model.tmodel");

// 设置步骤的超时时间为60秒
setDefaultTimeout(60 * 1000);
let child;

// 在所有测试场景执行之前准备测试环境，启动被测应用并等待其出现。 
BeforeAll(async function () {

    // 最小化CukeTest窗口以避免与UI测试干扰。
    CukeTest.minimize();

    // 根据执行环境确定样例目录路径。
    let sampleDir = path.dirname(process.execPath); // CukeTest默认的sample路径
    
    // 针对系统不同传入多个启动路径，会自动选择可用的路径
    child = await QtAuto.launchQtProcessAsync([
        // Linux
        `${sampleDir}/bin/dirview`, 
        // Windows
        `${sampleDir}\\bin\\dirview.exe`, 
        // Mac
        '/Applications/CukeTest.app/Contents/Frameworks/dirview', 
    ]); 

    // 等待被测应用的进程出现，最长等待时间为10秒。
    await model.getApplication("dirview").exists(10);
})

// 在每个测试场景执行之后捕获当前窗口的屏幕截图并附加到测试报告。
After(async function () {
    let screenshot = await model.getTree("Dir_View").takeScreenshot();
    this.attach(screenshot, 'image/png');
    await Util.delay(2000);
})

// 在所有测试场景执行结束后，关闭被测应用。
AfterAll(async function () {

    // 恢复CukeTest窗口大小，准备下一轮测试或结束测试工作。
    CukeTest.restore();
    CukeTest.maximize();

    // 关闭启动的测试应用进程。
    Util.stopProcess(child);
})

//// 你的步骤定义 /////
// {string} 占位符接收一个字符串类型参数，字符串传递给变量relativePath
Given("展开到{string}文件所在树节点", async function (relativePath) {

    // 将路径拆分成路径节点数组，将数据添加到报告中方便查看
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

    // 滚动到目录路径所在的位置
    await tree.scrollTo(dirNamePath);

    // 将更新后的目录路径数组保存到当前上下文中，方便后面步骤调用
    this.dirNamePath = dirNamePath;
});

Then("选中目标树节点并验证", async function () {
    let targetItem = await model.getTree('Dir_View').getItem(this.dirNamePath);
    // 如果目标不在可点击区域内则会展开到该节点位置
    await targetItem.scrollIntoView();
    await targetItem.expand();

    // 检查expanded属性是否为true，不符合时将显示指定的消息
    await targetItem.checkProperty('expanded', true, '没有选中目标树节点');
});

Then("将目标树节点展开到可视范围内", async function () {
    let targetItem = this.item;

    // 滚到到目标节点的可视范围
    await targetItem.scrollIntoView();
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量itemPathString
Given("目标树节点的itemPath为{string}，获取该树节点的对象", async function (itemPathString) {
    
    // 将字符串类型解析为数组
    let itemPath = JSON.parse(itemPathString);

    // 获取节点对象
    let targetItem = model.getTree("Dir_View").getItem(itemPath);
    if (!targetItem) {
        throw "target TreeItem is not exist in this itemPath " + itemPathString;
    }
    this.dirNamePath = itemPath;
    this.item = targetItem;
});

Then("应用截图", async function () {
    
    // 对应用截图并添加到报告中
    let screenshot = await model.getTree("Dir_View").takeScreenshot();
    this.attach(screenshot, 'image/png');
});
