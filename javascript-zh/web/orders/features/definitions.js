const { Before, After, BeforeAll, AfterAll, Given, When, Then, setDefaultTimeout } = require('cucumber');
const assert = require('assert');
const { Util } = require('leanpro.common');
const { chromium, firefox } = require('leanpro.web');
const xlsx = require('leanpro.xlsx');
const path = require('path');
const fs = require('fs');
const { CukeTest } = require('cuketest');
const { readXlsx, getOrders, getHeader, formatExcelTime, getLatestMessage} = require("./utils.js");

// 设置步骤的超时时间为60秒
setDefaultTimeout(60 * 1000);

let browser, context, page;

// 在所有测试前启动浏览器和新的浏览器上下文
BeforeAll(async function () {
    try {
        // 获取当前测试运行的配置信息，读取自定义的浏览器类型
        let info = await CukeTest.info();
        const browserType = info.profile.custom;
        const browserOptions = {
            headless: false, // 设置浏览器为非无头模式以便于观察运行情况
        };

        const isPath = fs.existsSync(browserType);

        // 如果browserType是一个路径，则按该路径启动浏览器
        if (isPath) {
            browser = await chromium.launch({ ...browserOptions, executablePath: browserType });
        } else {
            // 如果browserType不是路径，根据browserType指定的浏览器类型来启动浏览器
            const browserConfig = {
                firefox: async () => firefox.launch(browserOptions),
                chrome: async () => chromium.launch(browserOptions),
                edge: async () => chromium.launch({ ...browserOptions, channel: 'msedge' }),
            };

            // 默认使用Chrome运行web测试
            const launchBrowser = browserConfig[browserType] || browserConfig.chrome;
            browser = await launchBrowser();
        }
        context = await browser.newContext();
    } catch (error) {
        console.error('Failed to launch browser:', error);
    }
});

// 在所有测试后清理会话并关闭浏览器
AfterAll(async function () {
    await context.close();
    await browser.close();
});

// 在每个测试场景执行之后捕获当前页面的截图并附加到测试报告。
After(async function () {
    const screen = await page.screenshot();
    this.attach(screen, "image/png");
})

// {string} 占位符接收一个字符串类型参数，字符串传递给变量sampleName
Then("打开网址{string}样例", async function (sampleName) {
    // 启动名为"DemoErp"的示例Web应用，并返回应用的URL
    let url = await CukeTest.startSample(sampleName);

    // 创建一个新的页面标签
    page = await context.newPage();

    // 导航到指定的URL
    await page.goto(url);
});

// {string} 占位符接收一个字符串类型参数，两个字符串分别传递给变量user和pwd
When("输入用户名{string}，密码{string}，登录账号导航到指定页面", async function (user, pwd) {
    await page.fill('#username', user);
    await page.fill('#password', pwd);
    await page.click('button:has-text("登 录")');
});

// {string} 占位符接收一个字符串类型参数，两个字符串分别传递给变量filepath和orderNo
Then("点击“新建”按钮，读取excel文件{string}，根据{string}将订单数据录入到系统", async function (filepath, orderNo) {
    
    // 从 Excel 文件中读取订单数据
    const orderData = readXlsx(filepath);

    // 在订单数据中查找具有指定订单编号的订单
    const order = orderData.find((currentOrder) => {
        return currentOrder.订单编号 === orderNo;
    })
    await page.click('button:has-text("新建")');

    // 填写订单信息并提交
    await page.fill('#orderId', order.订单编号);

    await page.click('input#orderDate');
    await page.fill('input#orderDate', formatExcelTime(order.订单日期));
    await page.press('[placeholder="请选择"]', 'Enter');

    await page.click('#customer');
    await page.waitForSelector(".ant-select-item")
    await page.click(':nth-match(:text("' + order.客户+'"), 2)');

    await page.click('#deliveryDate');
    await page.fill('#deliveryDate', formatExcelTime(order.交货日期));

    await page.fill('#address', order.收货地址);
    await page.fill('#contacts', order.联系人);
    await page.fill('#phone', order.电话);
    await page.fill('#total', order['金额总计（元）'] + "");
    
    await page.click('button:has-text("提 交")');

    // 等待1000毫秒以确保提交结束
    await Util.delay(1000);
    const finishFlag = await page.isVisible("button:has-text('新建')");
    if (!finishFlag) {
        await page.click('button:has-text("返 回")');
    }
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量expected
Then("检查填写结果是否为{string}", async function (expected) {
    const msg = await getLatestMessage(page);
    let msgExpected = expected=='success'?'添加成功':'该订单编号已存在';
    this.attach(`实际填写结果为"${msg}"`);
    this.attach(`期望填写结果为"${msgExpected}"`);

    // 断言msgExpected == msg
    assert.equal(msgExpected, msg);
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量exportPath
Given("读取页面中的全部订单，导出为{string}", async function (exportPath) {
    let header = await getHeader(page);
    let listData = await getOrders(page);
    this.listData = listData;

    // 使用xlsx库创建新的Excel工作簿，将JSON数据转换为Excel表格，并将工作簿写入文件。
    let workbook = xlsx.utils.book_new();
    let filename = path.join(__dirname, exportPath);
    let sheet = xlsx.utils.json_to_sheet(listData, { header: header });
    if (fs.existsSync(filename)) {
        workbook = xlsx.readFile(filename);
        workbook.Sheets[workbook.SheetNames[0]] = sheet;
    } else {
        xlsx.utils.book_append_sheet(workbook, sheet, 'order');
    }
    xlsx.writeFile(workbook, filename);
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量csvPath
When("验证录入结果与导入的订单{string}信息一致", async function (csvPath) {
    // 获取应该导入的订单列表
    let filename = path.join(__dirname, csvPath);

    // 加载CSV文件并返回其数据
    let csvData = await Util.loadCsvFile(filename);
    csvData = csvData.filter((row) => row.expected !== "fail");

    // 校验导入的订单信息
    const listData = this.listData;
    const expectedOrdersData = readXlsx("./support/order.xlsx");
    const keys = ['订单编号', '客户', '订单日期', '交货日期', '收货地址', '联系人', '电话', '金额总计（元）'];

    for(let i=0; i < csvData.length; i++){
        let orderNo = csvData[i].orderNo;
        let actualRow = listData.find((rowData) => rowData.订单编号 == orderNo);
        let exptectedRow = expectedOrdersData.find((rowData) => rowData.订单编号 == orderNo);
        for(let key of keys){
            let actualValue = actualRow[key];
            let expectedValue = exptectedRow[key];
            if (key.match('日期')) {
                expectedValue = formatExcelTime(expectedValue);
            }
            assert(actualValue == expectedValue, `订单号${orderNo}录入错误，字段${key}的值应为${expectedValue}当实际上为${actualValue}`);
        }
    }
});

// {string} 占位符接收一个字符串类型参数，两个字符串分别传递给变量expected和orderNo
Given("删除录入{string}的订单{string}", async function (expected, orderNo) {
    if(expected=='fail'){
        return 'skipped';
    }else {
        await page.click(`text=${orderNo}`);
        await page.click('button:has-text("删除")');
        await page.waitForSelector('.ant-drawer-mask', {
            state: 'hidden'
        });
    }
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量orderNo
Then("验证订单{string}是否删除成功", async function (orderNo) {
    // 获取指定的选择器的可见状态
    let result = await page.isVisible(`text=${orderNo}`);

    // 使用assert库进行值的比较和断言验证，如果选择器不可见，则说明订单删除成功
    assert(result == false, `${orderNo} 订单删除失败`);
});
