const assert = require('assert');
const { Given, When, Then, setDefaultTimeout } = require('cucumber');
const { WinAuto } = require('leanpro.win');
const { Util } = require('leanpro.common');

// 设置默认步骤超时60秒
setDefaultTimeout(60 * 1000);

// 加载Windows应用的UI模型文件
let model = WinAuto.loadModel(__dirname + "/model1.tmodel");

//// 你的步骤定义 /////

// 设定应用路径
const appPath = "C:\\Qt\\4.8.6\\demos\\declarative\\samegame\\release\\samegame.exe";

Given("启动qml应用", async function () {
    Util.launchProcess(appPath);

    // 等待应用启动
    if (!await model.getWindow("Window").exists(5)){
        throw "Testing application did not lauch in-time."
    }
});

Given("开始新游戏", async function () {

    // 展示click三个参数(x, y, mouseKey)，坐标相对于控件(0,0)，1为点击鼠标左键
    await model.getPattern("new_game").click(0, 0, 1)
    await Util.delay(500)
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量color
When("消除{string}色", async function (color) {
    const colorMap = {
        '红': 'red',
        '绿': 'green',
        '蓝': 'blue'
    }

    // 点击指定颜色的横，直到没有新的横为止
    while(1){
        try {
            await model.getPattern(`${colorMap[color]}_row`).click()
            await Util.delay(500);
        } catch (err) {
            console.log(`没有新的${color}横`);
            break;
        }
    } 

    // 点击指定颜色的竖，直到没有新的竖为止
    while (1) {
        try {
            target = await model.getPattern(`${colorMap[color]}_col`).click();
            await Util.delay(500);
        } catch (err) {
            console.log(`没有新的${color}竖`);
            break;
        }
    }

    // 截取窗口的屏幕截图并附加到测试报告中
    let screenshot = await model.getWindow("Window").takeScreenshot();
    this.attach(screenshot, 'image/png');
});

Then("验证没有更多可以消除的色块", async function () {

    // 获取各颜色行的数量
    let redColCount = await model.getPattern(`red_col`).findAll();
    let redRowCount = await model.getPattern(`red_row`).findAll();
    let greenColCount = await model.getPattern(`green_col`).findAll();
    let greenRowCount = await model.getPattern(`green_row`).findAll();
    let blueColCount = await model.getPattern(`blue_col`).findAll();
    let blueRowCount = await model.getPattern(`blue_row`).findAll();

    // 使用断言验证各颜色竖行和横行的数量是否为 0
    assert.strictEqual(redColCount.length, 0);
    assert.strictEqual(redRowCount.length, 0);
    assert.strictEqual(greenColCount.length, 0);
    assert.strictEqual(greenRowCount.length, 0);
    assert.strictEqual(blueColCount.length, 0);
    assert.strictEqual(blueRowCount.length, 0); 

    // 截取窗口的屏幕截图并附加到测试报告中
    let screenshot = await model.getWindow("Window").takeScreenshot();
    this.attach(screenshot, 'image/png');
});

Then("验证应该看到胜利提示", async function () {

    // 如果胜利提示在 5 秒内不存在，则抛出异常
    if (!await model.getPattern("enter_name").exists(5)){
        throw "没有胜利提示出现"
    }

    // 截取窗口的屏幕截图并附加到测试报告中
    let screenshot = await model.getWindow("Window").takeScreenshot();
    this.attach(screenshot, 'image/png');
});

Then("关闭应用", async function () {
    await model.getWindow("Window").close();
});