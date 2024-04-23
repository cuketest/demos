const fs = require('fs');
const assert = require('assert');
const os = require('os');
const { Image, Ocr } = require('leanpro.visual');
const { Given, When, Then, BeforeAll, AfterAll, setDefaultTimeout } = require('cucumber');
const { CukeTest } = require('cuketest');
const { WinAuto } = require('leanpro.win');
const { Util } = require('leanpro.common');

// 获取操作系统名称
let osName = getOSname();

const version = os.release();

const isWindows7 = version.startsWith('6.1');

// 根据操作系统来加载不同的Windows应用的UI模型文件
let osModelMapping = {
    "Windows 10 and below": "/model.tmodel",
    "Windows 11": "/modelWin11.tmodel"
};
let model = WinAuto.loadModel(__dirname + osModelMapping[osName]);

// 设置项目路径
const projectPath = process.cwd() + '\\features\\data\\';

// 设置步骤的超时时间为20秒
setDefaultTimeout(20 * 1000);

// 在所有测试场景执行之前准备测试环境。
BeforeAll(async function () {

    // 如果项目路径存在，则删除该路径及其所有内容,清除缓存
    if (fs.existsSync(projectPath)) {
        fs.rmdirSync(projectPath, { recursive: true });
    }

    // 创建项目路径
    fs.mkdirSync(projectPath);

    // 最小化CukeTest窗口
    await CukeTest.minimize();
})

// 在所有测试场景执行结束后，关闭被测应用。
AfterAll(async function () {
    await model.getWindow("记事本").close();

    // 恢复CukeTest窗口状态并最大化
    await CukeTest.restore();
    await CukeTest.maximize();
})

//// 你的步骤定义 /////
Given("打开Windows记事本应用", async function () {

    // 启动本地记事本应用
    Util.launchProcess('notepad.exe');
    await model.getDocument("文本编辑器").exists(5);
    await model.getWindow("记事本").maximize();
});

Then("点击【文件】--【新建】", async function () {

    await model.getMenuItem("文件(F)").click();
    await model.getMenuItem("新建(N)").invoke();
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量text
When("在记事本中输入文本{string}", async function (text) {
    await model.getDocument("文本编辑器").set(text);
    this.text = text;

    // 检查目value属性是否符合预期的值。
    await model.getDocument("文本编辑器").checkProperty("value", text);
});

When("点击【文件】--【保存】", async function () {
    await model.getMenuItem("文件(F)").click();

    // 按下保存按钮
    await model.getMenuItem("保存(S)").invoke();
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量filename
When("在文件对话框中保存为项目路径中的{string}", async function (filename) {
    let filepath = projectPath + filename;
    this.filepath = filepath;

    if (fs.existsSync(filepath)) {
        //重复运行时文件会已存在
        fs.unlinkSync(filepath); 
    }
    await model.getEdit("文件名:1").set(filepath);
    //Win11上为文件对话框产生事件
    await model.getEdit("文件名:1").pressKeys(' '); 
    await model.getButton("保存(S)1").click();
    await Util.delay(2000);
});

Then("文件应该保存成功", async function () {

    // 校验文件存在
    let filepath = this.filepath;
    let exist = fs.existsSync(filepath);

    // 断言文件存在
    assert.strictEqual(exist, true, "文件应该存在");
    console.log(filepath + "文件已创建");

    // 读取文件内容，使用断言验证文件内容与期望值是否相等
    let filecontent = fs.readFileSync(filepath, { encoding: 'utf-8' });
    assert.strictEqual(filecontent, this.text, `期望：\n${this.text}\n实际：\n${filecontent}`);
    console.log(`文件内容为: ${filecontent}`);
});

When("打开字体设置界面", async function () {
    await model.getMenuItem("格式(O)").click();

    // 按下字体按钮
    await model.getMenuItem("字体(F)...").invoke();
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量font
When("从【字体】下拉框中选择{string}", async function (font) {

    // 等待字体下拉框启用再选择
    await model.getComboBox("字体(F):").waitProperty("enabled", true, 3);
    await model.getComboBox("字体(F):").select(font);
    await Util.delay(500);
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量font
When("从【字形】下拉框中选择{string}", async function (weight) {

    // 如果当前系统为win 11 则选择 Bold
    if (osName == "Windows 11") {
        weight = "Bold";
    }
    await model.getComboBox("字形(Y):").select(weight);
    await Util.delay(500);
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量size
When("从【大小】下拉框中选择{string}", async function (size) {
    await model.getComboBox("大小(S):").select(size);
    await Util.delay(500);
});

When("完成字体设置", async function () {
    await model.getButton("确定").click();
    await Util.delay(500);
});

Then("字体应该设置成功", async function () {

    // 将当前文本编辑区域的虚拟控件截图数据与预期图像进行比较，以验证界面元素的正确性。
    let screenshot = await model.getVirtual("virtual").takeScreenshot();
    let expectedImage = await Image.fromData(await model.getVirtual("virtual").modelImage());

    // 兼容win7
    if (isWindows7) expectedImage = await Image.fromData(await model.getVirtual("virtual-win7").modelImage());
    let actualImage = await Image.fromData(screenshot);
    let result = await Image.imageCompare(expectedImage, actualImage, {
        // 允许的最大像素百分比差异容忍度
        pixelPercentTolerance: 1, 
        // 忽略图像中的额外部分
        ignoreExtraPart: true 
    });

    // Ocr识别截图中的文字内容，并添加到报告中
    let ocrResult = await Ocr.getVisualText(screenshot);
    this.attach('OCR识别文字内容为: ' + ocrResult);

    // 将差异图片添加到报告中
    this.attach(await result.diffImage.getData(), "image/png");
    assert.strictEqual(result.equal, true);
});

/**
 * 获取操作系统名称
 * @returns {string} 返回操作系统名称，可能为 "Windows 11" 或 "Windows 10 and below"
 */
function getOSname() {
    let osRelease = os.release();
    let osReleaseSplit = osRelease.split(".");
    let osReleaseTail = osReleaseSplit[osReleaseSplit.length - 1];
    if (parseInt(osReleaseTail) > 20000) {
        return "Windows 11";
    } else {
        return "Windows 10 and below";
    }
}