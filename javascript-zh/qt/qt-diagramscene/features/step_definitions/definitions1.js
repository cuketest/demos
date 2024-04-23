const assert = require('assert');
const path = require('path');
const { Given, When, Then, BeforeAll, After, AfterAll, setDefaultTimeout } = require('cucumber');
const { QtAuto } = require('leanpro.qt');
const { Util, Keyboard } = require('leanpro.common');

//设置步骤超时时间为60秒
setDefaultTimeout(60 * 1000); 

// 加载Qt应用程序的UI模型文件
let model = QtAuto.loadModel(__dirname + "/model1.tmodel");


//// 你的步骤定义 /////

// 在所有测试场景执行之前准备测试环境，启动被测应用并等待其出现。 
BeforeAll(async function () {
    // 根据执行环境确定样例目录路径。
    let sampleDir = path.dirname(process.execPath); 
    // 针对系统不同传入多个启动路径，会自动选择可用的路径
    child = await QtAuto.launchQtProcessAsync([ 
        // Linux
        `${sampleDir}/bin/diagramscene`,
        // Windows
        `${sampleDir}\\bin\\diagramscene.exe`,
        // Mac
        '/Applications/CukeTest.app/Contents/Frameworks/diagramscene',
    ]);

    // 等待被测应用的进程出现，最长等待时间为10秒。
    await model.getApplication("diagramscene").exists(10);
    
    // 将应用最大化方便后续绘图操作
    await model.getWindow("Diagramscene1").maximize();

    // 禁用输入法
    Keyboard.disableIme();
})

// 在所有测试场景执行结束后，关闭被测应用。
After(async function () {
    let screen = await model.getWindow("Diagramscene1").takeScreenshot();
    this.attach(screen, "image/png");
})

// 在所有测试场景执行结束后，关闭被测应用。
AfterAll(async function () {

    // 关闭启动的测试应用进程。
    Util.stopProcess(child);
})

// {string} 占位符接收一个字符串类型参数，字符串传递给变量shape;
// {int} 占位符接收一个整数类型参数，整数分别传递给变量x, y;
Given("用户选择{string}形状并将其添加到工作区x坐标{int}，y坐标{int}", async function (shape, x, y) {

    await model.getButton(shape).click();
    await Util.delay(500);

    // 点击场景坐标x, y，如果坐标位置不在视图中，会将坐标位置滚动到视图中
    await model.getGraphicsView("QGraphicsView").clickScene(x,y);
});

// {string} 占位符分别接收一个字符串类型参数，字符串分别传递给变量shape1, shape2;
Then("工作区应该显示{string}和{string}形状", async function (shape1, shape2) {
    // 模型控件映射
    const map={
        Process:"ProcessItem",
        Conditional:"ConditionalItem"
    };
    await model.getGraphicsItem(map[shape1]).exists(5);
    await model.getGraphicsItem(map[shape2]).exists(5);
});

When("用户使用箭头工具连接这两个形状", async function () {

    await model.getButton("arrow").click();
    await model.getGraphicsItem("ProcessItem").drag();
    await model.getGraphicsItem("ConditionalItem").drop();
});

Then("这两个形状应该被一条箭头连接", async function () {

    // 断言箭头是否存在
    assert.ok(await model.getGraphicsItem("arrowItem").exists(),'箭头不存在');
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量shape;
Given("用户选择了一个已添加的形状{string}", async function (shape) {

    await model.getGraphicsItem(shape).click();
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量color;
When("用户更改该形状的颜色为{string}", async function (color) {

    const rect = await model.getButton("QToolButton").rect();
    
    // 控制坐标位置，点击按钮右边下拉
    await model.getButton("QToolButton").click(rect.width-3,rect.height/2);
    await model.getMenu("QMenu").exists(5);
    await model.getMenuItem(color).click();
});

Then("该形状的颜色应该变为{string}", async function (arg1) {
    
    // 滚动到视图位置
    await model.getGraphicsItem("ProcessItem").scrollIntoView();
    await model.getGraphicsItem("ProcessItem").checkImage();
});

Given("用户选择了一个连接箭头", async function () {
    
    const rect = await model.getGraphicsItem("arrowItem").rect();

    // 控制坐标位置，点击箭头
    await model.getGraphicsItem("arrowItem").click(rect.width/2+1,rect.height/2+1);
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量color;
When("用户更改该箭头的颜色为{string}", async function (color) {

    const rect = await model.getButton("QToolButton1").rect();

    // 控制坐标位置，点击按钮右边下拉
    await model.getButton("QToolButton1").click(rect.width - 3, rect.height / 2);
    await model.getMenuItem(color).click();
});

Then("该箭头的颜色应该变为{string}", async function (arg1) {
    await model.getGraphicsItem("arrowItem").scrollIntoView();
    await model.getGraphicsItem("arrowItem").checkImage();
});

// {int} 占位符接收一个整数类型参数，整数分别传递给变量x, y;
Given("用户在工作区坐标x{int}，坐标y{int}添加了一个文本框", async function (x, y) {

    await model.getButton("Text").click();
    await model.getGraphicsView("QGraphicsView").clickScene(x,y);
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量text;
When("用户在文本框中输入{string}", async function (text) {

    await Keyboard.pressKeys(text);
});

// {string} 占位符分别接收一个字符串类型参数，字符串分别传递给变量font, weight;
When("用户更改文本的字体为{string}，样式为{string}，并添加下划线", async function (font, weight) {

    await model.getComboBox("QComboBox").select(font);
    await model.getButton(weight).click();
    await model.getButton("Underline").click();
});

Then("文本框中的文本应该显示为{string}加粗字体，并带有下划线", async function (arg1) {

    try {
        await model.getGraphicsItem("TextItem").checkImage();
    } catch(err) {
        //添加源图到报告
        this.attach(await model.getGraphicsItem("TextItem").takeScreenshot(), "image/png");
        //添加目标图到报告
        this.attach(await model.getGraphicsItem("TextItem").modelImage(), "image/png");
        //如果图像不同，将差异图片附加到报告
        if (err.diffImage) this.attach(err.diffImage, "image/png");
        throw err;
    }
});

Given("用户已经在工作区添加了形状和文本，并已经进行了连接", async function () {

    await model.getGraphicsItem("ProcessItem").exists();
    await model.getGraphicsItem("ConditionalItem").exists();
    await model.getGraphicsItem("arrowItem").exists();
    await model.getGraphicsItem("TextItem").exists();
    const screenshot = await model.getGraphicsView("QGraphicsView").takeScreenshot();
    this.attach(screenshot, "image/png");
});

// {string} 占位符分别接收一个字符串类型参数，字符串分别传递给变量scale;
When("用户对画布进行缩放操作，缩放比例{string}", async function (scale) {
    
    // 获取缩放前rect
    const ProcessItemRect = await model.getGraphicsItem("ProcessItem").rect();
    const ConditionalItemRect = await model.getGraphicsItem("ConditionalItem").rect();
    const arrowItemRect = await model.getGraphicsItem("arrowItem").rect();
    const TextItemRect = await model.getGraphicsItem("TextItem").rect();
    
    await model.getComboBox("zoom").select(scale );
    
    // 将这些控件缩放前的rect保存到上下文中
    this.ProcessItemRect = ProcessItemRect;
    this.ConditionalItemRect = ConditionalItemRect;
    this.arrowItemRect = arrowItemRect;
    this.TextItemRect = TextItemRect;
    this.scale = scale;
});

Then("形状和文本应该按照缩放比例正确显示", async function () {

    // 获取缩放后recty
    const ProcessItemRect = await model.getGraphicsItem("ProcessItem").rect();
    const ConditionalItemRect = await model.getGraphicsItem("ConditionalItem").rect();
    const arrowItemRect = await model.getGraphicsItem("arrowItem").rect();
    const TextItemRect = await model.getGraphicsItem("TextItem").rect();

    // 将获取到的比例转换成数字类型
    const num = parseFloat(this.scale.replace('%', '')) / 100;
    await model.getGraphicsItem("ProcessItem").exists();
    await model.getGraphicsItem("ConditionalItem").exists();
    await model.getGraphicsItem("arrowItem").exists();
    await model.getGraphicsItem("TextItem").exists();

    // 校验缩放比例
    assert.equal((ProcessItemRect.width / this.ProcessItemRect.width).toFixed(1), num);
    assert.equal((ProcessItemRect.height / this.ProcessItemRect.height).toFixed(1), num);
    assert.equal((ConditionalItemRect.width / this.ConditionalItemRect.width).toFixed(1), num);
    assert.equal((ConditionalItemRect.height / this.ConditionalItemRect.height).toFixed(1), num);
    assert.equal((arrowItemRect.width / this.arrowItemRect.width).toFixed(1), num);
    assert.equal((arrowItemRect.height / this.arrowItemRect.height).toFixed(1), num);
    assert.equal((TextItemRect.width / this.TextItemRect.width).toFixed(1), num);
    assert.equal((TextItemRect.height / this.TextItemRect.height).toFixed(1), num);
});

When("用户在缩放后的画布上添加新的形状和文本", async function () {

    await model.getButton("I/O").click();
    // 点击场景坐标x, y，如果坐标位置不在视图中，会将坐标位置滚动到视图中
    await model.getGraphicsView("QGraphicsView").clickScene(500, 1000);
    await model.getButton("Conditional").click();
    await model.getGraphicsView("QGraphicsView").clickScene(800, 1000);

    await model.getButton("Text").click();
    await model.getGraphicsView("QGraphicsView").clickScene(500, 1200);
    await Keyboard.pressKeys("示例文本2");
});

When("用户创建新的连接线", async function () {

    await model.getButton("arrow").click();
    await model.getGraphicsItem("I/OItem").drag();
    await model.getGraphicsItem("ConditonalItem2").drop();
});

Then("新添加的形状和文本应该被正确显示并连接", async function () {

    await model.getGraphicsItem("I/OItem").exists();
    await model.getGraphicsItem("ConditonalItem2").exists();
    await model.getGraphicsItem("arrowItem2").exists();
    await model.getGraphicsItem("TextItem2").exists();
});

