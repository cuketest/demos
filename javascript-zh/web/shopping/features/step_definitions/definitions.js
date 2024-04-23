const { Util } = require('leanpro.common');
let { BeforeAll, AfterAll, Given, When, Then,setDefaultTimeout } = require('cucumber');
let assert = require('assert');
const { chromium } = require('leanpro.web');

// 设置步骤的超时时间为60秒
setDefaultTimeout(60 * 1000);
let browser, context, page;

// 在所有测试前启动浏览器和新的浏览器上下文
BeforeAll(async function () {
    browser = await chromium.launch({
        // executablePath: "/usr/bin/lbrowser",
        headless: false
    });
    context = await browser.newContext();
    page = await context.newPage();

});

// 在所有测试后清理会话并关闭浏览器
AfterAll(async function () {
    // 清理会话，关闭浏览器
    // ---------------------
    await context.close();
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量url
Given("打开浏览器并导航到{string}", async function (url) {
    // 导航到指定的URL,超时时间为60秒
    await page.goto(url, { timeout: 60000 });

    // 断言页面标题是否为指定值
    let pageTitle = await page.title();
    return assert.equal(pageTitle, "Flux Cart");
})

When("点击添加到购物车按钮", async function () {
    await page.click("#addToCart");
});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量message
Then("此时按钮文字应该为{string}", async function (message) {

    let text = await page.innerText('#addToCart');

    // 断言text == message
    return assert.deepEqual(text, message);

});

// {string} 占位符接收一个字符串类型参数，字符串传递给变量bill
Then("弹出账单 {string}", async function (bill) {

    // 延迟1秒
    await Util.delay(1000);
    let text = await page.innerText('.total');
    return assert.deepEqual(text, bill);

});

// {int} 占位符接收一个整数类型参数，字符串传递给变量count,{string} 占位符接收一个字符串类型参数，字符串递给变量itemName
When("添加{int}件{string}到购物车", async function (count, itemName) {
    // Item info which matching the option in page.
    const itemList = {
        '40oz Bottle': {
            value: 0, price: 4.99
        },
        '6 Pack': {
            value: 1, price: 12.99
        },
        '30 Pack': {
            value:2, price: 19.99
        }
    };

    // 如果总价不存在，则初始化为 0
    this.total = this.total ? this.total : 0;

    // 循环添加商品到购物车
    let addBtn = await page.$('#addToCart');
    for (let i = 0; i < count; i++) {
        await sleep();
        console.log(`[value = "${itemList[itemName].value}"]`);
        await page.selectOption('select', `${itemList[itemName].value}`);
        if(await addBtn.innerText() !== "Sold Out"){
            await addBtn.click();
            this.total += itemList[itemName].price;
        }else{
            console.log(`${itemName} sold out.`);
        }
    }
});

Then("验证购物车总价符合预期", async function () {
    let text = await page.innerText('.total');

    // 从文本内容中提取购物车总价，并转换为数字类型
    let cartTotal = Number(text.split('$')[1]);

    // 将预期总价转换为字符串并保留两位小数
    let expectTotal = this.total.toFixed(2);    

    // 验证页面上显示的购物车总价与预期总价是否相等，若不相等则抛出断言错误
    assert.deepEqual(cartTotal, expectTotal);
    this.attach(`预期价格为${expectTotal}，实际价格为${cartTotal}`);
});

async function sleep(){
    const INTERVAL = 300;
    await Util.delay(INTERVAL);    
}