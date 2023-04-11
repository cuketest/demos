const assert = require('assert');
const path = require('path');
const { Given, When, BeforeAll, After, AfterAll, setDefaultTimeout } = require('cucumber');
const { QtAuto } = require('leanpro.qt');
const { Util } = require('leanpro.common');

setDefaultTimeout(60 * 1000); //set step timeout to be 60 seconds
let model = QtAuto.loadModel(__dirname + "/model1.tmodel");
let child;

BeforeAll(async function () {
    let sampleDir = path.dirname(process.execPath) // CukeTest默认的sample路径
    child = await QtAuto.launchQtProcessAsync([  // 针对系统不同传入多个启动路径，会自动选择可用的路径
        sampleDir + "/bin/standarddialogs",
        sampleDir + "\\bin\\standarddialogs.exe"
    ]); 
    await model.getApplication("standarddialogs").exists(10);
})

After(async function () {
    let screen = await model.getWindow("Standard_Dialogs").takeScreenshot()
    this.attach(screen, "image/png")
})

AfterAll(async function () {
    Util.stopProcess(child);
})

//// 你的步骤定义 /////
Given("打开数值对话框", async function () {
    await model.getButton("输入型对话框").click();
    await model.getButton("QInputDialog::getInt()").click();
});

Given("打开下拉对话框", async function () {
    await model.getButton("输入型对话框").click();
    await model.getButton("QInputDialog::getItem()").click();
});

Given("打开文本对话框", async function () {
    await model.getButton("QInputDialog::getMultiLineTex").click();
});

When("修改数值框的值为{int}", async function (value) {
    await model.getWindow("QInputDialog::getInteger()").exists(1);
    await model.getEdit("qt_spinbox_lineedit").set(value);
    await Util.delay(1000);
    await model.getButton("OK").click()
    let labelControl = await model.getButton("QInputDialog::getInt()").next("Label");
    let inputValue = parseInt(await labelControl.text(), 10);
    assert.equal(inputValue, value, "没有成功修改数值");
});

When("修改下拉框的值为{string}", async function (season) {
    await model.getComboBox("ComboBox").select(season);
    await Util.delay(1000);
    await model.getButton("OK").click()
    let labelControl = await model.getButton("QInputDialog::getItem()").next("Label");
    let selectedValue = await labelControl.text();
    assert.equal(selectedValue, season, "没有成功修改下拉框");
});

When("修改文本框的内容为如下", async function (docString) {
    await model.getEdit("Edit").set(docString);
    await Util.delay(1000);
    await model.getButton("OK").click();
    let labelControl = await model.getButton("QInputDialog::getMultiLineTex").next("Label");
    let textValue = await labelControl.text();
    assert.equal(textValue, docString, "没有成功文本框内容");
});
