const path = require('path');
const { Given, When, BeforeAll, After, AfterAll, setDefaultTimeout } = require('cucumber');
const { QtAuto } = require('leanpro.qt');
const { AtkAuto } = require('leanpro.atk');
const { Util } = require('leanpro.common');

// 设置步骤超时时间为60秒
setDefaultTimeout(60 * 1000);

// 加载Atk应用的UI模型文件
let model = AtkAuto.loadModel(__dirname + "/model1.tmodel");
let child;

// 在所有测试场景执行之前准备测试环境，启动被测应用并等待其出现。
BeforeAll(async function () {

    // CukeTest默认的sample路径
    let sampleDir = path.dirname(process.execPath); 
    const appPath = `${sampleDir}/bin/standarddialogs`;
    child = await launchAtkApp(appPath);
    await model.getGeneric("Standard_Dialogs").exists(10);
})

// 在每个测试场景执行之后捕获当前窗口的屏幕截图并附加到测试报告。
After(async function () {
    let screen = await model.getGeneric("Standard_Dialogs").takeScreenshot();
    this.attach(screen, "image/png");
})

// 在所有测试场景执行结束后，关闭被测应用。
AfterAll(async function () {
    if(child){
        Util.stopProcess(child);
    }
})

//// 你的步骤定义 /////
Given("打开数值对话框", async function () {
    await model.getButton("Input_Dialogs").click();
    await model.getButton("QInputDialog::getInt()").click();
});

Given("打开下拉对话框", async function () {
    await model.getButton("Input_Dialogs").click();
    await model.getButton("QInputDialog::getItem()").click();
});

Given("打开文本对话框", async function () {
    await model.getButton("QInputDialog::getMultiLineText").click();
});

When("修改数值框的值为{int}", async function (value) {
    
    // 等待对话框打开
    await model.getWindow("QInputDialog::getInteger()").exists(1);
    // await model.getEdit("qt_spinbox_lineedit").set(value); // 无法识别到SpinBox中的Edit，也识别不到SpinBox，识别为了Button
    await model.getEdit("Percentage:").pressKeys(value);
    // 延迟1秒执行
    await Util.delay(1000);
    await model.getButton("OK").click();

    // 获取按钮的下一个 Label 控件的值来检查是否修改成功
    let labelControl = await model.getButton("QInputDialog::getInt()").next("Label");
    await labelControl.checkProperty("name", value + '%', '没有成功修改数值');
});

When("修改下拉框的值为{string}", async function (season) {
    await model.getComboBox("Spring").click(); 
    await model.getGeneric(season).click();
    // await model.getComboBox("Spring").select(season); // 未实现
    await Util.delay(1000);
    await model.getButton("OK1").click();

    // 获取按钮的下一个 Label 控件的值来检查是否修改成功
    let labelControl = await model.getButton("QInputDialog::getItem()").next("Label");
    await labelControl.checkProperty('name', season, '没有成功修改下拉框');
});

When("修改文本框的内容为如下", async function (docString) {
    await model.getEdit("Edit1").set(docString);
    await Util.delay(1000);
    await model.getButton("OK2").click();

    // 获取按钮的下一个 Label 控件的值来检查是否修改成功
    let labelControl = await model.getButton("QInputDialog::getMultiLineText").next("Label");
    await labelControl.checkProperty('name', docString, '没有成功修改文本框内容');
});

/**
 * 启动Atk应用程序
 * @param {string} appPath - 应用程序路径
 * @returns {ChildProcess} 返回生成的子进程对象
 */
function launchAtkApp(appPath){
    const {spawn} = require('child_process');
    const env = {
        GTK_MODULES:"gail:atk-bridge",
        QT_ACCESSIBILITY: 1,
        QT_LINUX_ACCESSIBILITY_ALWAYS_ON: 1,
        ...process.env
    }
    const proc = spawn(appPath, {env});
    return proc;
}