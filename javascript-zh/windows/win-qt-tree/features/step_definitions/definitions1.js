const { Given, When, Then, BeforeAll, AfterAll, After, setDefaultTimeout } = require('cucumber');
const { WinAuto } = require('leanpro.win');
const { Util } = require('leanpro.common');
const path = require("path");

// 设置默认步骤超时60秒
setDefaultTimeout(60 * 1000);

// 加载Qt应用程序的UI模型文件
let model = WinAuto.loadModel(__dirname + "/model.tmodel");
let child;

// 在所有测试场景执行之前准备测试环境，启动被测应用并等待其出现。 
BeforeAll(async function () {

    // 启动Windows样例应用
    child = Util.launchSample("dirview.exe");

    // 如果应用不存在则抛出错误
    if (!await model.getWindow("Window").exists(5)) {
        throw new Error("Testing application was not launched.");
    }
});

// 在每个测试场景执行之后捕获当前窗口的屏幕截图并附加到测试报告。
After(async function () {
    this.attach(Util.takeScreenshot(), 'image/png');
})

// 在所有测试场景执行结束后，关闭被测应用。
AfterAll(async function () {
    await Util.stopProcess(child);
})

//// 你的步骤定义 /////

// {string} 占位符接收一个字符串类型参数，字符串传递给变量treeItemName
Given("点击模型中的树节点{string}", async function (treeItemName) {

    // 展示click三个参数(x, y, mouseKey)，坐标相对于控件(0,0)，1为点击鼠标左键
    await model.getTreeItem(treeItemName).click(0, 0, 1);
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量treeItemName
Given("展开和折叠模型中的树节点{string}", async function (treeItemName) {

    // 展开节点
    await model.getTreeItem(treeItemName).expand();

    // 等待2秒展开树节点之后折叠节点
    await Util.delay(2000);
    await model.getTreeItem(treeItemName).collapse();
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量pathString
Given("点击树中的{string}", async function (pathString) {

    // 将字符串类型解析为数组
    let treepath = JSON.parse(pathString);
    treepath[0] = await getDiskName(treepath[0]); // 处理磁盘符名称
    await model.getTree("Tree").select(treepath);
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量pathString
Given("折叠与展开树中的{string}", async function (pathString) {
    let treepath = JSON.parse(pathString);

    // 将第3列滚动到试图
    await model.getTree("Tree").showHeader(3)

    // 通过树状结构获取树节点数
    await model.getTree("Tree").childCount(treepath);
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量relativePath
Given("访问并选中{string}文件", async function (relativePath) {

    // 将路径拆分成路径节点数组
    let treepath = path.resolve(__dirname, '..', relativePath).split('\\');
    let tree = model.getTree('Tree');
    // 由于磁盘名称不同这里为路径中的磁盘名做修改
    // 通过磁盘符（如"C:"）获取完整磁盘名称
    treepath[0] = await getDiskName(treepath[0])

    // 将选定的树节点和路径保存到上下文中
    this.item = await tree.select(treepath);
    this.treepath = treepath;
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量expectedItemName
Then("{string}节点选中", async function (expectedItemName) {

    // 检查属性name和focused是否为期望值
    await this.item.checkProperty('name', expectedItemName);
    await this.item.checkProperty('focused', true);
});

// 获取磁盘名称
async function getDiskName(deskSign) {

    // 使用模型中的树(Tree)来查找符合条件的控件(TreeItem)
    let [diskItem, _] = await model.getTree("Tree").findControls({
        // 控件类型为TreeItem
        "type": "TreeItem",
        // 名称包含指定标志的控件 
        "name~": deskSign 
    })

    // 返回找到的磁盘名称
    return diskItem.name();
}
