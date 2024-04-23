const path = require('path');
const { Given, When, BeforeAll, After, AfterAll, setDefaultTimeout } = require('cucumber');
const { QtAuto } = require('leanpro.qt');
const { Util } = require('leanpro.common');

// 设置步骤的超时时间为60秒
setDefaultTimeout(60 * 1000);

// 加载Qt应用程序的UI模型文件
let model = QtAuto.loadModel(__dirname + "/model1.tmodel");
let child;

// 在所有测试场景执行之前准备测试环境，启动被测应用并等待其出现。 
BeforeAll(async function () {

    // 根据执行环境确定样例目录路径。
    let sampleDir = path.dirname(process.execPath);
    
    // 针对系统不同传入多个启动路径，会自动选择可用的路径
    child = await QtAuto.launchQtProcessAsync([
        // Linux
        `${sampleDir}/bin/standarddialogs`, 
        // Windows
        `${sampleDir}\\bin\\standarddialogs.exe`, 
        // Mac
        '/Applications/CukeTest.app/Contents/Frameworks/standarddialogs', 
    ]); 

    // 等待被测应用的进程出现，最长等待时间为10秒。
    await model.getApplication("standarddialogs").exists(10);
})

// 在每个测试场景执行之后捕获当前窗口的屏幕截图并附加到测试报告。
After(async function () {
    let screen = await model.getWindow("Standard_Dialogs").takeScreenshot();
    this.attach(screen, "image/png");
})

// 在所有测试场景执行结束后，关闭被测应用。
AfterAll(async function () {

    // 关闭启动的测试应用进程。
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

// {int} 占位符接收一个整数类型参数，整数值传递给变量value
When("修改数值框的值为{int}", async function (value) {

    // 等待文本对话框打开
    await model.getWindow("QInputDialog::getInteger()").exists(1);
    await model.getEdit("qt_spinbox_lineedit").set(value);
    await Util.delay(1000);
    await model.getButton("OK").click();

    // 获取按钮的下一个 Label 控件的值来检查是否修改成功
    let labelControl = await model.getButton("QInputDialog::getInt()").next("Label");
    await labelControl.checkProperty("text", value + '%', '没有成功修改数值');
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量season
When("修改下拉框的值为{string}", async function (season) {
    await model.getComboBox("ComboBox").select(season);
    await Util.delay(1000);
    await model.getButton("OK").click();

    // 获取按钮的下一个 Label 控件的值来检查是否修改成功
    let labelControl = await model.getButton("QInputDialog::getItem()").next("Label");
    await labelControl.checkProperty('text', season, '没有成功修改下拉框');
});

// 用 docString 变量接收测试步骤中传递的文档字符串
When("修改文本框的内容为如下", async function (docString) {
    await model.getEdit("Edit").set(docString);
    await Util.delay(1000);
    await model.getButton("OK").click();

    // 获取按钮的下一个 Label 控件的值来检查是否修改成功
    let labelControl = await model.getButton("QInputDialog::getMultiLineTex").next("Label");
    await labelControl.checkProperty('text', docString, '没有成功修改文本框内容');
});
