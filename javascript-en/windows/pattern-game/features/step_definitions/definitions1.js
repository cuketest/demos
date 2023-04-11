const assert = require('assert');
const { Given, When, Then, setDefaultTimeout } = require('cucumber');
const { WinAuto } = require('leanpro.win');
const { Util } = require('leanpro.common');

setDefaultTimeout(120 * 1000);
let model = WinAuto.loadModel(__dirname + "/model1.tmodel");

//// your step definition /////
const appPath = "C:\\Qt\\4.8.6\\demos\\declarative\\samegame\\release\\samegame.exe";

Given("Start the qml application", async function () {
    Util.launchProcess(appPath);
    if (!await model.getWindow("Window").exists(5)){
        throw "Testing application did not lauch in-time."
    }// Waiting for application launch
});

Given("Start a new game", async function () {
    await model.getPattern("new_game").click(0, 0, 1)
    await Util.delay(500)
});

When("Eliminate {string} color", async function (color) {
    while(1){
        try {
            await model.getPattern(`${color}_row`).click()
            await Util.delay(500);
        } catch (err) {
            console.log(`No new ${color} line`);
            break;
        }
    } 
    while (1) {
        try {
            target = await model.getPattern(`${colorMap[color]}_col`).click();
            await Util.delay(500);
        } catch (err) {
            console.log(`No new ${color} vertical`);
            break;
        }
    }
    let screenshot = await model.getWindow("Window").takeScreenshot();
    this.attach(screenshot, 'image/png');
});

Then("Verify that there are no more color blocks that can be eliminated", async function () {
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

Then("Validation should see a victory prompt", async function () {
    if (!await model.getPattern("enter_name").exists(5)){
        throw "No victory prompt appears"
    }

    let screenshot = await model.getWindow("Window").takeScreenshot();
    this.attach(screenshot, 'image/png');
});

Then("Close the app", async function () {
    await model.getWindow("Window").close();
});