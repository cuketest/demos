const { BeforeAll, AfterAll, Given, When, Then, setDefaultTimeout } = require('cucumber');
const assert = require('assert');
const { chromium } = require('leanpro.web');

setDefaultTimeout(60 * 1000);
let browser, context;

BeforeAll(async function () {
    browser = await chromium.launch({
        // executablePath: "/usr/bin/lbrowser",
        headless: false
    });
    context = await browser.newContext();
});

AfterAll(async function () {
    // 清理会话，关闭浏览器
    // ---------------------
    await context.close();
});

// page 变量在其它操作步骤中也使用，定义为外部变量
let page;
Given("打开网站首页{string}", async function (url) {

    // Open new page
    page = await context.newPage();

    // Go to https://cuketest.github.io/apps/shopping/
    await page.goto(url);
});

When("点击Pay parking到表单提交页面", async function () {
    // Click text=/.*Pay parking.*/
    await page.click('text=/.*Pay parking.*/');
    // assert.equal(page.url(), 'https://cuketest.github.io/apps/shopping/pagar-estacionamento.html');

});

let ticketNum, creditCard, dueDate, code;
When("输入表单数据，点击Paying按钮", async function (table) {
    // 获取table中的值
    const tableData = table.hashes()[0];

    ticketNum = tableData['TICKET'];
    creditCard = tableData['CREDIT CARD'];
    dueDate = tableData['DUE DATE'];
    code = tableData['CODE'];

    // Fill input[name="ticketnum"]
    await page.fill('input[name="ticketnum"]', ticketNum);

    // Fill input[name="creditcard"]
    await page.fill('input[name="creditcard"]', creditCard);

    // Fill input[name="duetime"]
    await page.fill('input[name="duetime"]', dueDate);

    // Fill input[name="code"]
    await page.fill('input[name="code"]', code);

    // Click button[type="submit"]
    await page.click('button[type="submit"]');
});

Then("在Payment 页面中能够显示出上述表单中输入的值", async function () {

    assert.equal(ticketNum, await page.innerText('[data-label="Ticket Number"]'));
    assert.equal(creditCard, await page.innerText('[data-label="Credit card"]'));
    assert.equal(dueDate, await page.innerText('[data-label="Due Date"]'));
    assert.equal(code, await page.innerText('[data-label="Code"]'));
});