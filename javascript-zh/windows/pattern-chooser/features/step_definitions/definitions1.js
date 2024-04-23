const assert = require('assert');
const { Given, When, Then, Before, After, setDefaultTimeout } = require('cucumber');
const { WinAuto } = require('leanpro.win');
const { QtAuto } = require('leanpro.qt');
const { Util } = require('leanpro.common');
const path = require('path');
const fs = require('fs');
const os = require('os');

// 根据操作系统平台加载模型
let model = os.platform() ==  "win32" 
    ? WinAuto.loadModel(__dirname + "/model1.tmodel")
    : QtAuto.loadModel(__dirname + "/model1.tmodel");

// 设置默认超时时间1000秒
setDefaultTimeout(1000 * 1000);

//// 你的步骤定义 /////

let childProcess;
const animationDur = 1000;

// 在每个带有标签@only-windows场景之前运行
Before({ tags: "@only-windows" }, async function () {
    if (os.platform() !== "win32") return "skipped";
})

// 在每个带有标签@only-full场景之前运行
Before({ tags: "@only-full"}, async function () {
    try{
        // 加载Qt应用程序的UI模型文件
        this.modelQt = QtAuto.loadModel(__dirname + "/model1.tmodel");
    }catch(e){
        return "skipped"
    }
})

// 在每个测试场景执行之后捕获当前窗口的屏幕截图并附加到测试报告，关闭进程
After(async function (testCase) {
    try {
        let image = await this.window.takeScreenshot();
        this.attach(image, "image/png");
        Util.stopProcess(childProcess);
    } catch (e) {
        return
    }
})

// {int} 占位符接收一个字符串类型参数，字符串传递给变量count
When("循环点击四个图案{int}次并统计识别时间", async function (count) {
    let reports = [];
    const ptns = ["相机", "眼镜", "字典", "图标"];

    // 执行多次点击操作并记录每个操作的持续时间，然后将结果以 JSON 格式附加到测试报告中。
    for (let i = 0; i < count; i++) {
        let report = {};
        for (let ptn of ptns) {
            let beforeTime = new Date().getTime();
            await model.getPattern(ptn).click();
            let afterTime = new Date().getTime();
            let duration = afterTime - beforeTime;
            report[ptn] = duration + 'ms';
        }
        reports.push(report);
    }
    this.attach(JSON.stringify(reports, null, '\t'));
});

Then("关闭应用", async function () {
    Util.stopProcess(childProcess);
});

Given("启动应用并等待", async function () {

    // 针对系统不同传入多个启动路径，会自动选择可用的路径
    const possibleAppPathes = [
        path.join(path.dirname(process.execPath), "bin/appchooser.exe"),
        path.join(path.dirname(process.execPath), "bin/appchooser"),
        // Mac
        '/Applications/CukeTest.app/Contents/Frameworks/appchooser',
    ]
    const [appPath, ..._] = possibleAppPathes.filter((appPath) => fs.existsSync(appPath));
    
    // 针对不同系统，调用不同的启动应用方式
    if (os.platform() == 'win32'){
        childProcess = await Util.launchProcess(appPath);
        this.window = model.getWindow("Window");
    }else{
        childProcess = await QtAuto.launchQtProcessAsync(appPath);
        this.window = model.getWindow("GraphicsView");
    }

    // 等待应用启动并激活窗口
    await this.window.exists(5);
    await this.window.activate();
});

Given("启动Qt应用并等待", async function () {

    // 针对系统不同传入多个启动路径，会自动选择可用的路径
    const possibleAppPathes = [
        path.join(path.dirname(process.execPath), "bin/appchooser.exe"),
        path.join(path.dirname(process.execPath), "bin/appchooser"),
        // Mac
        '/Applications/CukeTest.app/Contents/Frameworks/appchooser', 
    ]
    childProcess = await QtAuto.launchQtProcessAsync(possibleAppPathes);
    this.window = this.modelQt.getWindow("GraphicsView");
    await this.window.exists(5);
});

When("验证相机此时不居中", async function () {
    await Util.delay(animationDur);
    let result = await model.getPattern('居中相机').exists(2);

    // 验证居中相机图案是否存在
    assert.equal(result, false);
});

Then("点击{string}", async function (arg1) {
    await model.getPattern('相机').click();
});

Then("验证相机此时居中", async function () {
    await Util.delay(animationDur);
    let result = await model.getPattern('居中相机').exists(2);
    assert.equal(result, true);
});

const benchmark = 10;
// {string} 占位符接收一个字符串类型参数，字符串传递给变量ptn
Given("直接操作Pattern{string}", async function (ptn) {
    let beforeTime = new Date().getTime();
    for (let i = 0; i < benchmark; i++) {
        let rect = await model.getPattern(ptn).rect();
        let score = await model.getPattern(ptn).score();
        console.log(JSON.stringify(await model.getPattern(ptn).modelProperties(), null, '\t'));
        await model.getPattern(ptn).click();
        await Util.delay(animationDur);
        await model.getPattern("图标").click();
        await Util.delay(animationDur);
    }
    let afterTime = new Date().getTime();
    let duration = afterTime - beforeTime - 2 * animationDur * benchmark;
    this.directDuration = duration;
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量ptn
When("缓存后操作Pattern{string}", async function (ptn) {
    let beforeTime = new Date().getTime();

    // 重新查找定位图案的匹配位置, 返回本对象
    let ptnModel = await model.getPattern(ptn).locate();
    let ptnViceModel = await model.getPattern("眼镜").locate();
    for (let i = 0; i < benchmark; i++) {
        let rect = await ptnModel.rect();
        let score = await ptnModel.score();
        await ptnModel.click();
        await Util.delay(animationDur);
        await ptnViceModel.click();
        await Util.delay(animationDur);
    }
    let afterTime = new Date().getTime();
    let duration = afterTime - beforeTime - 2 * animationDur * benchmark;
    this.cacheDuration = duration;
});

Then("输出比较", async function () {
    console.log(`直接操作${benchmark}次的耗时为${this.directDuration}。`);
    console.log(`缓存后操作${benchmark}次的耗时为${this.cacheDuration}。`);
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量virtualName
When("点击级联虚拟控件{string}", async function (virtualName) {
    if (virtualName.search('Qt') > -1) {
        await this.modelQt.getVirtual(virtualName).click();
    } else {
        await model.getVirtual(virtualName).click();
    }
});

Then("通过Windows控件虚拟化点击左上角", async function () {
    let panel = model.getGeneric("Custom");
    let rect = await panel.rect();
    let virtual = panel.getVirtual();

    // 在虚拟控件上点击坐标 (50, 50)
    await virtual.click(50, 50);
});

Then("通过Qt控件虚拟化点击右上角", async function () {
    let panel = this.modelQt.getGraphicsView("GraphicsView");
    let rect = await panel.rect();
    let virtual = panel.getVirtual();
    await virtual.click(rect.width - 50, 50);
});