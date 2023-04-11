const assert = require('assert');
const { Given, When, Then, setDefaultTimeout } = require('cucumber');
const { QtAuto } = require('leanpro.qt');
const { Util } = require('leanpro.common');

setDefaultTimeout(60 * 1000); //set step timeout to be 60 seconds
let model = QtAuto.loadModel(__dirname + "/model1.tmodel");

//// 你的步骤定义 /////
const appPath = "/usr/lib/qt4/demos/declarative/samegame/samegame";

Given("启动qml应用", async function () {
    await QtAuto.launchQtProcessAsync(appPath);
    if (!await model.getWindow("Window").exists(5)) {
        throw "Testing application did not lauch in-time."
    }// Waiting for application launch
});

Given("开始新游戏", async function() {
    await model.getPattern("new_game").click()
    await Util.delay(500)
});

When("消除{string}色", async function (color) {
    const colorMap = {
        '红': 'red',
        '绿': 'green',
        '蓝': 'blue'
    }
    while(1) {
        try {
            await model.getPattern(`${colorMap[color]}_row`).click()
            await Util.delay(500);
        } catch (err) {
            console.log(`没有新的${color}横`);
            break;
        }
    } 
    while (1) {
        try {
            target = await model.getPattern(`${colorMap[color]}_col`).click();
            await Util.delay(500);
        } catch (err) {
            console.log(`没有新的${color}竖`);
            break;
        }
    }
    let screenshot = await model.getWindow("Window").takeScreenshot();
    this.attach(screenshot, 'image/png');
});

Then("验证没有更多可以消除的色块", async function() {
    let redColCount = await model.getPattern(`red_col`).findAll();
    let redRowCount = await model.getPattern(`red_row`).findAll();
    let greenColCount = await model.getPattern(`green_col`).findAll();
    let greenRowCount = await model.getPattern(`green_row`).findAll();
    let blueColCount = await model.getPattern(`blue_col`).findAll();
    let blueRowCount = await model.getPattern(`blue_row`).findAll();
    assert.strictEqual(redColCount.length, 0);
    assert.strictEqual(redRowCount.length, 0);
    assert.strictEqual(greenColCount.length, 0);
    assert.strictEqual(greenRowCount.length, 0);
    assert.strictEqual(blueColCount.length, 0);
    assert.strictEqual(blueRowCount.length, 0); 

    let screenshot = await model.getWindow("Window").takeScreenshot();
    this.attach(screenshot, 'image/png');
});

Then("验证应该看到胜利提示", async function() {
    if (!await model.getPattern("enter_name").exists(5)){
        throw "没有胜利提示出现"
    }

    let screenshot = await model.getWindow("Window").takeScreenshot();
    this.attach(screenshot, 'image/png');
});

Then("关闭应用", async function() {
    await model.getWindow("Window").close();
});