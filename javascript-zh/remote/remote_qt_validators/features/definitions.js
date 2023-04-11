const { BeforeAll, AfterAll, setDefaultTimeout } = require('cucumber');
const { Given, When, Then } = require('cucumber');
const { CukeTest } = require("cuketest");
const path = require('path');
const assert = require('assert');

let QtAuto, modelQt;
setDefaultTimeout(60 * 1000);
BeforeAll(async function () {
    let auto = await CukeTest.connect({
        wsEndpoint: 'ws://127.0.0.1:3131/ws'
    });

    QtAuto = auto.qtAuto;
    const { runSettings: RunSettings } = auto;
    await RunSettings.set({ slowMo: 500 });

    let capabilities = await auto.capabilities();
    let homeDir = capabilities.homePath;
    let qtAppPath = path.join(homeDir, 'bin/validators.exe');

    //Launch Qt application "validators"
    await QtAuto.launchQtProcessAsync(qtAppPath);

    modelQt = await QtAuto.loadModel(__dirname + "/model.tmodel");
    await modelQt.getApplication("validators").exists(10);

})

AfterAll(async function () {
    //Click "pushButton"
    await modelQt.getButton("pushButton").click();
    //Quit Qt application "validators"
    await modelQt.getApplication("validators").quit();
});


When("选择国家{string}", async function (country) {
    // // ComboBox不用select方法选择的work around
    // await modelQt.getComboBox("localeSelector").click()
    // let item = await modelQt.getList("List").findItem(country)
    // await item.click()
    await modelQt.getComboBox("localeSelector").select(country);
});

When("输入数字{int}", async function (input) {
    await modelQt.getSpinBox("minVal").click()
    await modelQt.getSpinBox("minVal").set(`${input}`)
});

Then("实际结果为{string}", async function (expected) {
    let actualValue = await modelQt.getSpinBox("minVal").value();
    assert.equal(actualValue, expected)
});

When("输入最小值{int}", async function (input) {
    await modelQt.getSpinBox("minVal").click()
    await modelQt.getSpinBox("minVal").set(`${input}`)
});

Then("最小结果应该为{string}", async function (expected) {
    let actualValue = await modelQt.getSpinBox("minVal").value();
    assert.equal(actualValue, expected)
});

When("输入最大值{int}", async function (input) {
    await modelQt.getSpinBox("maxVal").click()
    await modelQt.getSpinBox("maxVal").set(`${input}`)
});

Then("最大结果应该为{string}", async function (expected) {
    let actualValue = await modelQt.getSpinBox("maxVal").value();
    assert.equal(actualValue, expected)
});

