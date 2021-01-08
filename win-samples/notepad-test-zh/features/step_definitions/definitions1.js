const { Image } = require('leanpro.visual');
const { BeforeAll, AfterAll, setDefaultTimeout } = require('cucumber');
const cuketest = require('cuketest');
const { Given, When, Then } = require('cucumber');
const { AppModel } = require('leanpro.win');
const { Util } = require('leanpro.common');
const fs = require('fs');
const assert = require('assert');
let model = AppModel.loadModel(__dirname + "/model1.tmodel");  

const projectPath = process.cwd() + '\\features\\data\\';

setDefaultTimeout(20 * 1000);
BeforeAll(async function () {
    if (fs.existsSync(projectPath)){
        fs.rmdirSync(projectPath, { recursive: true });
    }
    fs.mkdirSync(projectPath);
    await cuketest.minimize();
})

AfterAll(async function () {
    // await model.getWindow("记事本").close();
    await cuketest.restore();
    await cuketest.maximize();
})

//// 你的步骤定义 /////

When("打开Windows记事本应用", async function () {
    Util.launchProcess('notepad.exe');
    await Util.delay(1000);
});

When("点击【格式】--【字体】", async function () {
    await model.getMenuItem("格式(O)").click();
    await model.getMenuItem("字体(F)...").click();
});


When("在记事本中输入文本{string}", async function (text) {
    await model.getDocument("文本编辑器").set(text);
    this.text = text;
});

When("点击【文件】--【保存】", async function () {
    await model.getMenuItem("文件(F)").click();
    await model.getMenuItem("保存(S)").click();
});

When("在弹出来的文件对话框中输入{string}", async function (filename) {
    await model.getEdit("文件名:1").click();
    await model.getEdit("文件名:1").clearAll();
    await model.getEdit("文件名:").set(filename);
});

When("在文件对话框中保存为项目路径中的{string}", async function (filename) {
    let filepath = projectPath + filename;
    this.filepath = filepath;
    await model.getEdit("文件名:1").set(filepath);
    await model.getButton("保存(S)1").click();
    await Util.delay(2000);
});
Then("文件应该保存成功", async function () {
    let filepath = this.filepath;
    let exist = fs.existsSync(filepath);
    assert.strictEqual(exist, true);
    console.log(filepath + "文件已创建");

    let filecontent = fs.readFileSync(filepath, { encoding: 'utf-8' });
    assert.strictEqual(filecontent, this.text);
    console.log(`文件内容为: ${filecontent}`);
});
When("从【字体】下拉框中选择{string}", async function (font) {
    await model.getComboBox("字体(F):").select(font);
    await Util.delay(500);
});
When("从【字形】下拉框中选择{string}", async function (weight) {
    await model.getComboBox("字形(Y):").select(weight);
    await Util.delay(500);
});
When("从【大小】下拉框中选择{string}", async function (size) {
    await model.getComboBox("大小(S):").select(size);
    await Util.delay(500);
});
When("单击【确定】按钮以关闭【字体...】对话框", async function () {
    await model.getButton("确定").click();
    await Util.delay(500);
});
Then("字体应该设置成功", async function () {
    let screenshot = await model.getDocument("文本编辑器").takeScreenshot();
    let expectedImage = await Image.fromData(await model.getDocument("文本编辑器").modelImage());
    let actualImage = await Image.fromData(screenshot);
    let result = await Image.imageCompare(expectedImage, actualImage, {
        pixelPercentTolerance: 0.1,
        ignoreExtraPart: true
    });
    this.attach(await result.diffImage.getData(), 'image/png');
    assert.strictEqual(result.equal, true);
});