const { Keyboard } = require('leanpro.common');
const { Util } = require('leanpro.common');
const { QtAuto } = require('leanpro.qt');
const { Given, When, Then } = require('cucumber');
const { BeforeAll, After, AfterAll, setDefaultTimeout } = require('cucumber');
const { CukeTest } = require('cuketest');
const { join, dirname } = require('path');
const os = require('os');

// 加载Qt应用程序的UI模型文件
const model = QtAuto.loadModel(__dirname + "/model1.tmodel");

// 设置步骤的超时时间为60秒
setDefaultTimeout(60 * 1000);
let child;

// 在所有测试场景执行之前准备测试环境，启动被测应用并等待其出现。 
BeforeAll(async function () {
    // 最小化CukeTest窗口以避免与UI测试干扰。
    CukeTest.minimize();

    // 根据执行环境确定样例目录路径。
    let sampleDir = dirname(process.execPath); // CukeTest默认的sample路径

    // 针对系统不同传入多个启动路径，会自动选择可用的路径
    child = await QtAuto.launchQtProcessAsync([  
        // Linux
        `${sampleDir}/bin/fetchmore`, 
        // Windows
        `${sampleDir}\\bin\\fetchmore.exe`, 
        // Mac
        '/Applications/CukeTest.app/Contents/Frameworks/fetchmore', 
    ]); 

    // 等待被测应用的进程出现，最长等待时间为10秒。
    await model.getApplication("fetchmore").exists(10);
});

// 在每个测试场景执行之后捕获当前窗口的屏幕截图并附加到测试报告。
After(async function () {
    await Util.delay(2000);
    let screenshot = await model.getWindow("Fetch_More_Example").takeScreenshot();
    this.attach(screenshot, 'image/png');
});

// 在所有测试场景执行结束后，关闭被测应用。
AfterAll(async function () {
    // 恢复CukeTest窗口大小，准备下一轮测试或结束测试工作。
    CukeTest.restore();
    CukeTest.maximize();

    // 关闭启动的测试应用进程。
    await Util.stopProcess(child);
});

//// 你的步骤定义 /////

// {string} 占位符接收一个字符串类型参数，字符串传递给变量dir
When("搜索CukeTest目录下的{string}", async function (dir) {
    // 根据操作系统类型，确定安装路径，并在指定目录下搜索
    let installPath;
    if (getOSType()=='macOS'){
        installPath = '/Applications/CukeTest.app/Contents';
        targetDir = join(installPath, 'Frameworks');
    } else {
        installPath = dirname(process.execPath);
        targetDir = join(installPath, 'bin');
    }

    // 在搜索框中输入搜索路径
    await model.getEdit("Edit").set(join(targetDir, dir));

    // 等待100毫秒，确保搜索操作已被触发
    await Util.delay(100);
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量fileName
Then("点击选项{string}", async function (fileName) {
    let listObject = model.getList("List");
    let targetItem;
    while (true) {
        // 在列表中查找指定的文件名
        if (targetItem = await listObject.findItem(fileName)) break;

        // 获取当前列表项数量，并尝试滚动到底部加载更多项
        let count = await listObject.itemCount();
        await listObject.scrollToBottom(); 

        // 等待加载完成
        await Util.delay(1000);
        let newCount = await listObject.itemCount();

        // 如果项数未增加，表示已滚动到底部
        if (newCount === count) break; 
    }
    if (!targetItem) throw 'object not found: ' + fileName;

    // 滚动到目标项并进行选择与高亮显示
    let index = await targetItem.itemIndex();
    await listObject.scrollTo(index);
    let item = await listObject.getItem(index);
    await item.select();
    await item.highlight();
});

// {int} 占位符接收一个整数类型参数，整数值传递给变量itemIndex
Then("点击第{int}个选项", async function (itemIndex) {
    let listObject = model.getList("List");

    // 滚动到指定索引的列表项
    await listObject.scrollTo(itemIndex);
    let item = await listObject.getItem(itemIndex);

    // 选择并高亮显示该列表项
    await item.select();
    await item.highlight()
});

// {int} 占位符接收一个整数类型参数，整数值传递给变量itemIndex
Given("操作对象为列表中的第{int}个选项", async function (itemIndex) {
    let targetItem = model.getList('List').getItem(itemIndex);
    this.targetItem = targetItem;
});

Then("跳转到目标选项位置", async function () {
    let targetItem = this.targetItem;

    // 滚动视图，使目标选项可见
    await targetItem.scrollIntoView();
});

Then("点击目标选项", async function () {
    let targetItem = this.targetItem;

    // 选择并高亮显示目标选项
    await targetItem.select();
    await targetItem.highlight();
});

function getOSType() {
    // 获取当前操作系统的平台信息，如"win32"表示Windows系统。
    const platform = os.platform();
    
    switch (platform) {
        case 'win32':
            return 'Windows';
        case 'linux':
            return 'Linux';
        case 'darwin':
            return 'macOS';
        default:
            return 'Unknown';
    }
}
