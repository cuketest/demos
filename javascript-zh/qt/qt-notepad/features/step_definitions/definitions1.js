const assert = require('assert');
const { AfterAll } = require('cucumber');
const { Given, When, Then, setDefaultTimeout } = require('cucumber');
const { QtAuto } = require('leanpro.qt');
const { Image } = require('leanpro.visual');
const { WinAuto } = require('leanpro.win');
const { Util, RunSettings } = require('leanpro.common');
const { platform } = require('os');
const { join, dirname } = require('path');
const { existsSync } = require('fs');

// 设置步骤超时时间为60秒
setDefaultTimeout(60 * 1000); 

// 指定自动化操作方法调用之间的最小间隔时间为500毫秒，用于减慢自动化速度，且在输出面板中输出每个自动化操作的报告信息
RunSettings.set({ slowMo: 500, reportSteps: true });

// 加载Qt应用程序的UI模型文件
let model = QtAuto.loadModel(__dirname + "/model1.tmodel");

// 在所有测试场景执行结束后，关闭被测应用。
AfterAll(async function () {
    await model.getApplication("notepad").quit();
})
//// 你的步骤定义 /////

Given("打开Qt记事本应用", async function () {
    // 启动Qt应用文件"notepad"
    /**
     * 注意点1：launchQtProcessAsync() 方法以数组形式传入不同平台的多个可执行文件路径
     *   CukeTest会自动的选择可用路径来启动应用
     **/
    await QtAuto.launchQtProcessAsync([
        join(dirname(process.execPath), '\\bin\\notepad.exe'),
        "/usr/lib/cuketest/bin/notepad"
    ]);
    // 等待Qt应用"notepad"
    await model.getApplication("notepad").exists(10);
});

// 用 docString 变量接收测试步骤中传递的文档字符串
When("在记事本中输入文本", async function (docstring) {
    // 点击 "textEdit"
    await model.getEdit("textEdit").click(140, 40);
    // 设置控件值为"Hello World!"
    await model.getEdit("textEdit").set(docstring);

    // 将窗口截屏，添加到报告中
    const sc = await model.getWindow("MainWindow").takeScreenshot();
    this.attach(sc, 'image/png');

    // 检查 plainText 属性值是否为 Hello World!
    await model.getEdit("textEdit").checkProperty("plainText", "Hello World!");
});

When("点击保存", async function () {
    // 点击 "Save"
    await model.getButton("Save").click();
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量relativePath
When("在文件对话框中保存为项目路径中的{string}", async function (relativePath) {
    /**
     * 注意点2：路径使用Nodejs核心库path来拼接，避免路径分隔符的问题。
     * （Windows系统中路径分隔符为反斜杠'\'，而Linux系统中为斜杆'/'）
     **/
    const fullpath = join(process.cwd(), relativePath);
    // 设置控件值为文件全路径
    /**
     * 注意点3：对于不同平台的分支操作，可以用os.platform()方法获取系统信息，接着分支处理
     */
    if (platform == 'win32') {
        const modelWin = await WinAuto.loadModel(__dirname + "/model1.tmodel");
        await modelWin.getEdit("文件名:1").exists(10);
        await modelWin.getEdit("文件名:1").set(fullpath);
        await modelWin.getButton("保存(S)").click();
        if (await modelWin.getButton("是(Y)").exists(1)) {
            await modelWin.getButton("是(Y)").click();
        }
    } else {
        await model.getEdit("fileNameEdit").set(fullpath);
        await Util.delay(500);
        //点击 "Save1"
        await model.getButton("Save1").click();
        // 如果文件存在则覆写
        if (await model.getButton("Yes").exists(1)) {
            await model.getButton("Yes").click();
        }
    }

    // 将路径保存到上下文中，给其他步骤调用
    this.fullpath = fullpath
});

Then("文件应该保存成功", async function () {

    // 获取上面步骤传递的fullpath，判断是否存在
    assert(existsSync(this.fullpath));
});

When("打开字体设置界面", async function () {

    // 将记事本编辑区域截图，并创建一个图像对象
    let screen1 = await model.getEdit("textEdit").takeScreenshot();
    this.controlImage = await Image.fromData(screen1);
    this.attach(screen1, 'image/png');
    //点击 "Font"
    await model.getButton("Font").click();
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量font
When("从【字体】下拉框中选择{string}", async function (font) {
    // 选择字体列表项
    const data = await model.getList("FontListView").data();
    if (data.indexOf(font) == -1) font = "Times New Roman";

    // 将font变量保存到上下文中，给其他步骤调用
    this.font = font;
    await model.getList("FontListView").select(font);
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量style
When("从【字形】下拉框中选择{string}", async function (style) {

    // 将style变量保存到上下文中，给其他步骤调用
    this.style = style;
    await model.getList("StyleListView").select(style);
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量size
When("从【大小】下拉框中选择{string}", async function (size) {

    // 将字体大小保存到上下文中，给其他步骤调用
    this.fontSize = size;
    await model.getList("SizeListView").select(size);
});

When("完成字体设置", async function () {
    // 点击 "OK"
    await model.getButton("OK").click();

    // 控件截图并添加到报告中
    const sc = await model.getWindow("MainWindow").takeScreenshot();
    this.attach(sc, 'image/png');
});

Then("字体应该设置成功", async function () {
    // 构建预期的font属性值字符串，用于属性检查
    const fontFamily = this.font;
    const fontSize = this.fontSize;
    const fontWeight = -1;
    const fontStyle = 5;
    const letterSpacing = 50;
    const underline = 1;
    const strikeout = 0;
    const overline = 0;
    const outline = 0;
    const shadow = 0;
    const style = this.style;

    // Linux系统不包含style信息
    const styleSuffix = (platform == 'win32') ? `,${style}` : '';
    const fontString = `${fontFamily},${fontSize},${fontWeight},${fontStyle},${letterSpacing},${underline},${strikeout},${overline},${outline},${shadow}${styleSuffix}`;
    
    // 将fontString值添加到测试报告
    this.attach(`font属性值为：${fontString}`);
    await model.getEdit("textEdit").checkProperty("font", fontString);

    // 将修改字体前后的截图拼接后，附到报告中
    let screen2 = await model.getEdit("textEdit").takeScreenshot();
    let modelImage = await Image.fromData(screen2);
    let combinedImage = this.controlImage.drawImage(modelImage, this.controlImage.width + 10, 0);
    this.attach(await combinedImage.getData(), 'image/png');
});
