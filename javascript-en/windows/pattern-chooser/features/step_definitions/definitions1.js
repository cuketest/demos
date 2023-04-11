const assert = require('assert');
const { Given, When, Then, Before, After, setDefaultTimeout } = require('cucumber');
const { WinAuto } = require('leanpro.win');
const { QtAuto } = require('leanpro.qt')
const { Util } = require('leanpro.common');
const path = require('path');
const os = require('os')

let model = WinAuto.loadModel(__dirname + "/model1.tmodel");
let modelQt = QtAuto.loadModel(__dirname + "/model1.tmodel");
setDefaultTimeout(60 * 1000);

//// your step definition /////

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

When("Cycle through the four patterns {int} times and count the recognition time", async function (count) {
    let reports = [];
    const ptns = ["camera", "glasses", "dictionary", "icon"];
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

Then("close the app", async function () {
    Util.stopProcess(childProcess);
});

Given("Launch the app and wait", async function () {
    childProcess = QtAuto.launchQtProcess([
        path.join(path.dirname(process.execPath), "bin/appchooser.exe"),
        path.join(path.dirname(process.execPath), "bin/appchooser")
    ]);
    await model.getPattern('camera').wait(5);
});

When("Verify that the camera is not centered at this time", async function () {
    await Util.delay(animationDur);
    let result = await model.getPattern('Center the camera').exists(2);
    assert.equal(result, false);
});

Then("Click {string}", async function (arg1) {
    await model.getPattern('camera').click();
});

Then("Verify that the camera is now centered", async function () {
    await Util.delay(animationDur);
    let result = await model.getPattern('Center the camera').exists(2);
    assert.equal(result, true);
});

const benchmark = 10;
Given("Directly operate on Pattern {string}", async function (ptn) {
    let beforeTime = new Date().getTime();
    for (let i = 0; i < benchmark; i++) {
        let rect = await model.getPattern(ptn).rect();
        let score = await model.getPattern(ptn).score();
        console.log(JSON.stringify(await model.getPattern(ptn).modelProperties(), null, '\t'));
        await model.getPattern(ptn).click();
        await Util.delay(animationDur);
        await model.getPattern("icon").click();
        await Util.delay(animationDur);
    }
    let afterTime = new Date().getTime();
    let duration = afterTime - beforeTime - 2 * animationDur * benchmark;
    this.directDuration = duration;
});

When("Post-cache operation Pattern{string}", async function (ptn) {
    let beforeTime = new Date().getTime();
    let ptnModel = await model.getPattern(ptn).locate();
    let ptnViceModel = await model.getPattern("glasses").locate();
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

Then("Output comparison", async function () {
    console.log(`The direct operation of ${benchmark} times takes ${this.directDuration}.`)
    console.log(`The post cache operation of ${benchmark} times takes ${this.cacheDuration}.`)
});

When("Click on the cascade virtual control {string}", async function (virtualName) {
    if (virtualName.search('Qt') > -1) {
        await modelQt.getVirtual(virtualName).click()
    } else {
        await model.getVirtual(virtualName).click()
    }
});

Then("Click on the top right corner by Windows Control Virtualization", async function () {
    let panel = model.getGeneric("Custom");
    let rect = await panel.rect()
    let virtual = panel.getVirtual();
    await virtual.click(rect.width - 50, 50)
});

Then("Click on the top left corner by Qt control virtualization", async function () {
    let panel = modelQt.getGraphicsView("GraphicsView");
    let rect = await panel.rect()
    let virtual = panel.getVirtual();
    await virtual.click(50, 50)
});