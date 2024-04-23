const assert = require('assert');
const { Given, When, Then, Before, After, setDefaultTimeout } = require('cucumber');
const { WinAuto } = require('leanpro.win');
const { QtAuto } = require('leanpro.qt');
const { Util } = require('leanpro.common');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Load model based on the operating system platform
let model = os.platform() == "win32" 
    ? WinAuto.loadModel(__dirname + "/model1.tmodel")
    : QtAuto.loadModel(__dirname + "/model1.tmodel");

// Set the default timeout to 1000 seconds
setDefaultTimeout(1000 * 1000);

//// your step definition /////

let childProcess;
const animationDur = 1000;

// Run before each scenario with the tag @only-windows
Before({ tags: "@only-windows" }, async function () {
    if (os.platform() !== "win32") return "skipped";
})

// Run before each scenario with the tag @only-full
Before({ tags: "@only-full"}, async function () {
    try{
        // Load the UI model file for Qt applications
        this.modelQt = QtAuto.loadModel(__dirname + "/model1.tmodel");
    }catch(e){
        return "skipped"
    }
})

// Capture the screenshot of the current window and attach it to the test report, then close the process after each test scenario
After(async function (testCase) {
    try {
        let image = await this.window.takeScreenshot();
        this.attach(image, "image/png");
        Util.stopProcess(childProcess);
    } catch (e) {
        return
    }
})

// {int} Placeholder receives a string type parameter, which is passed to the variable count
When("Cycle through the four patterns {int} times and count the recognition time", async function (count) {
    let reports = [];
    const ptns = ["camera", "glasses", "dictionary", "icon"];
    
    // Perform multiple click operations and record the duration of each operation, then append the results in JSON format to the test report.
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

    // Pass multiple startup paths for different systems, and the available path will be automatically selected
    const possibleAppPathes = [
        path.join(path.dirname(process.execPath), "bin/appchooser.exe"),
        path.join(path.dirname(process.execPath), "bin/appchooser"),
        // Mac
        '/Applications/CukeTest.app/Contents/Frameworks/appchooser',
    ]
    const [appPath, ..._] = possibleAppPathes.filter((appPath) => fs.existsSync(appPath));

    // For different systems, invoke different methods to start the application.
    if (os.platform() == 'win32') {
        childProcess = await Util.launchProcess(appPath);
        this.window = model.getWindow("Window");
    } else {
        childProcess = await QtAuto.launchQtProcessAsync(appPath);
        this.window = model.getWindow("GraphicsView");
    }

    // Wait for the application to start and activate the window.
    await this.window.exists(5);
    await this.window.activate();
});

Given("Launch the Qt app and wait", async function () {

    // Provide multiple launch paths based on system to automatically select an available path.
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
        await this.modelQt.getVirtual(virtualName).click();
    } else {
        await model.getVirtual(virtualName).click();
    }
});

Then("Click on the top right corner by Windows Control Virtualization", async function () {
    let panel = model.getGeneric("Custom");
    let rect = await panel.rect()
    let virtual = panel.getVirtual();
    await virtual.click(rect.width - 50, 50)
});

Then("Virtualize clicking the top-left corner through Windows controls", async function () {
    let panel = model.getGeneric("Custom");
    let rect = await panel.rect();
    let virtual = panel.getVirtual();

    // 在虚拟控件上点击坐标 (50, 50)
    await virtual.click(50, 50);
});