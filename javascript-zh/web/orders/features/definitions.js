const { Before, After, BeforeAll, AfterAll, Given, When, Then, setDefaultTimeout } = require('cucumber');
const assert = require('assert');
const { Util } = require('leanpro.common');
const { chromium } = require('leanpro.web');
const xlsx = require('leanpro.xlsx');
const path = require('path');
const fs = require('fs');
const { CukeTest } = require('cuketest');
const { readXlsx, getOrders, getHeader, formatExcelTime} = require("./utils.js")
setDefaultTimeout(60 * 1000);

let browser, context, page;
BeforeAll(async function () {
    browser = await chromium.launch({
        headless: false
    });
    context = await browser.newContext();
    
});

AfterAll(async function () {
    // 清理会话，关闭浏览器
    // ---------------------
    await context.close();
    await browser.close();
});

After(async function () {
    const screen = await page.screenshot();
    this.attach(screen, "image/png");
})

Then("打开网址{string}样例", async function (sampleName) {
    let url = await CukeTest.startSample(sampleName);
    page = await context.newPage();
    await page.goto(url);
});

When("输入用户名{string}，密码{string}，登录账号导航到指定页面", async function (user, pwd) {
    await page.fill('#username', user);
    await page.fill('#password', pwd);
    await page.click('button:has-text("登 录")');
});

Then("点击“新建”按钮，读取excel文件{string}，根据{string}将订单数据录入到系统", async function (filepath, orderNo) {
    const orderData = readXlsx(filepath)
    const order = orderData.find((currentOrder) => {
        return currentOrder.订单编号 === orderNo
    })
    await page.click('button:has-text("新建")');

    await page.fill('#orderId', order.订单编号);

    await page.click('input#orderDate');
    await page.fill('input#orderDate', formatExcelTime(order.订单日期));
    await page.press('[placeholder="请选择"]', 'Enter');

    await page.click('#customer');
    await page.click(':nth-match(:text("' + order.客户+'"), 2)');

    await page.click('#deliveryDate');
    await page.fill('#deliveryDate', formatExcelTime(order.交货日期))

    await page.fill('#address', order.收货地址);
    await page.fill('#contacts', order.联系人);
    await page.fill('#phone', order.电话);
    await page.fill('#total', order['金额总计（元）'] + "");
    await page.click('button:has-text("提 交")');
    await Util.delay(1000);
    const finishFlag = await page.isVisible("button:has-text('新建')");
    if (!finishFlag) {
        await page.click('button:has-text("返 回")');
    }
});

Then("检查填写结果是否为{string}", async function (expected) {
    const msg = await page.innerText(".ant-message-notice-content")
    let msgExpected = expected=='success'?'添加成功':'该订单编号已存在';
    this.attach(`实际填写结果为"${msg}"`);
    this.attach(`期望填写结果为"${msgExpected}"`);
    assert.equal(msgExpected, msg);
});

Given("读取页面中的全部订单，导出为{string}", async function (exportPath) {
    let header = await getHeader(page)
    let listData = await getOrders(page);
    this.listData = listData;

    // 将当前列表保存为excel
    let workbook = xlsx.utils.book_new();
    let filename = path.join(__dirname, exportPath)
    let sheet = xlsx.utils.json_to_sheet(listData, { header: header });
    if (fs.existsSync(filename)) {
        workbook = xlsx.readFile(filename);
        workbook.Sheets[workbook.SheetNames[0]] = sheet;
    } else {
        xlsx.utils.book_append_sheet(workbook, sheet, 'order');
    }
    xlsx.writeFile(workbook, filename);
});

When("验证录入结果与导入的订单{string}信息一致", async function (csvPath) {

    // 获取应该导入的订单列表
    let filename = path.join(__dirname, csvPath);
    let csvData = await Util.loadCsvFile(filename);
    csvData = csvData.filter((row) => row.expected !== "fail")

    // 校验导入的订单信息
    const listData = this.listData;
    const expectedOrdersData = readXlsx("./support/order.xlsx")
    const keys = ['订单编号', '客户', '订单日期', '交货日期', '收货地址', '联系人', '电话', '金额总计（元）'];

    for(let i=0; i < csvData.length; i++){
        let orderNo = csvData[i].orderNo
        let actualRow = listData.find((rowData) => rowData.订单编号 == orderNo)
        let exptectedRow = expectedOrdersData.find((rowData) => rowData.订单编号 == orderNo)
        for(let key of keys){
            let actualValue = actualRow[key];
            let expectedValue = exptectedRow[key];
            if (key.match('日期')) {
                expectedValue = formatExcelTime(expectedValue);
            }
            assert(actualValue == expectedValue, `订单号${orderNo}录入错误，字段${key}的值应为${expectedValue}当实际上为${actualValue}`)
        }
    }
});


Given("删除录入{string}的订单{string}", async function (expected, orderNo) {
    if(expected=='fail'){
        return 'skipped';
    }else {
        await page.click(`text=${orderNo}`);
        await page.click('button:has-text("删除")');
    }
});

Then("验证订单{string}是否删除成功", async function (orderNo) {
    let result = await page.isVisible(`text=${orderNo}`);
    assert(result == false, `${orderNo} 订单删除失败`)
});
