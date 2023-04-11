const { Workflow, scenario, defineStep, step } = require('leanrunner');
const assert = require('assert');
const { QtAuto } = require('leanpro.qt');
const { Util } = require('leanpro.common');

let model = QtAuto.loadModel(__dirname + "/model1.tmodel");
/**
         * Process information
         * language: English
         * Title: Autoplay Games
         * Description: Automatic development of images through the  Happy Elimination sample application that comes with qt. Qt 4 needs to be installed in the environment. The reference path of the sample application is:
    "{QT4_PATH}\demos\declarative\samegame\release\samegame.exe"
         */
//// your step definition /////
const appPath = "/usr/lib/qt4/demos/declarative/samegame/samegame";

defineStep(" Happy Elimination", async function () {
    child = await QtAuto.launchQtProcessAsync(appPath);
    await Util.delay(1000);
    if (!await model.getWindow("Window").exists(5)) {
        throw "Testing application did not lauch in-time."
    }// Waiting for application launch
});

defineStep("Start a new game", async function() {
    await model.getPattern("new_game").click()
    await Util.delay(500)
});

defineStep("Eliminate {string} color", async function (color) {
    while(1) {
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

defineStep("Verify that there are no more color blocks that can be eliminated", async function() {
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

defineStep("Validation should see a victory prompt", async function() {
    if (!await model.getPattern("enter_name").exists(5)){
        throw "No victory prompt appears"
    }

    let screenshot = await model.getWindow("Window").takeScreenshot();
    this.attach(screenshot, 'image/png');
});

defineStep("Close the app", async function() {
    await model.getWindow("Window").close();
});

async function main() {
    await scenario(`Complete a game`, async () => {
        await step(`Start the qml application`);
        await step(`Start a new game`);
        await step(`Eliminate "red" color`);
        await step(`Eliminate "blue" color`);
        await step(`Eliminate "green" color`);
        await step(`Eliminate "red" color`);
        await step(`Eliminate "blue" color`);
        await step(`Eliminate "green" color`);
        await step(`Eliminate "red" color`);
        await step(`Eliminate "blue" color`);
        await step(`Eliminate "green" color`);
        await step(`Verify that there are no more color blocks that can be eliminated`);
        await step(`Validation should see a victory prompt`);
        await step(`Close the app`);
    })
}

Workflow.run(main)