const assert = require('assert');
const { Given, When, Then, Before, After, setDefaultTimeout } = require('cucumber');
const { WinAuto } = require('leanpro.win');
const { QtAuto } = require('leanpro.qt')
const { Util } = require('leanpro.common');
const path = require('path');
const os = require('os')

let model = WinAuto.loadModel(__dirname + "/model1.tmodel");
let modelQt = QtAuto.loadModel(__dirname + "/model1.tmodel");
setDefaultTimeout(1000 * 1000); //set step timeout to be 30 seconds

//// 你的步骤定义 /////

let childProcess;
const animationDur = 1000;

Before({ tags: "@only-windows" }, async function () {
    if (os.platform() !== "win32") return "skipped"
})

After(async function (testCase) {
    try {
        let image = await modelQt.getGraphicsView("GraphicsView").takeScreenshot();
        this.attach(image, "image/png");
        Util.stopProcess(childProcess);
    } catch (e) {
        return
    }
})

When("循环点击四个图案{int}次并统计识别时间", async function (count) {
    let reports = [];
    const ptns = ["相机", "眼镜", "字典", "图标"];
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
    childProcess = QtAuto.launchQtProcess([
        path.join(path.dirname(process.execPath), "bin/appchooser.exe"),
        path.join(path.dirname(process.execPath), "bin/appchooser")
    ]);
    await model.getPattern('相机').wait(5);
});

When("验证相机此时不居中", async function () {
    await Util.delay(animationDur);
    let result = await model.getPattern('居中相机').exists(2);
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

When("缓存后操作Pattern{string}", async function (ptn) {
    let beforeTime = new Date().getTime();
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
    console.log(`直接操作${benchmark}次的耗时为${this.directDuration}。`)
    console.log(`缓存后操作${benchmark}次的耗时为${this.cacheDuration}。`)
});

When("点击级联虚拟控件{string}", async function (virtualName) {
    if (virtualName.search('Qt') > -1) {
        await modelQt.getVirtual(virtualName).click()
    } else {
        await model.getVirtual(virtualName).click()
    }
});

Then("通过Windows控件虚拟化点击左上角", async function () {
    let panel = model.getGeneric("Custom");
    let rect = await panel.rect()
    let virtual = panel.getVirtual();
    await virtual.click(50, 50)
});

Then("通过Qt控件虚拟化点击右上角", async function () {
    let panel = modelQt.getGraphicsView("GraphicsView");
    let rect = await panel.rect()
    let virtual = panel.getVirtual();
    await virtual.click(rect.width - 50, 50)
});