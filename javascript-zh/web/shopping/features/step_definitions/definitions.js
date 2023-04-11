const { Util } = require('leanpro.common');
let { BeforeAll, AfterAll, Given, When, Then,setDefaultTimeout } = require('cucumber')
let assert = require('assert')
const { chromium } = require('leanpro.web');

setDefaultTimeout(60 * 1000);
let browser, context, page;

BeforeAll(async function () {
    browser = await chromium.launch({
        // executablePath: "/usr/bin/lbrowser",
        headless: false
    });
    context = await browser.newContext();
    page = await context.newPage();

});

AfterAll(async function () {
    // 清理会话，关闭浏览器
    // ---------------------
    await context.close();
});

Given("打开浏览器并导航到{string}", async function (url) {
    await page.goto(url);
    let pageTitle = await page.title();
    return assert.equal(pageTitle, "Flux Cart");
})

When("点击添加到购物车按钮", async function () {
    await page.click("#addToCart");
});

Then("此时按钮文字应该为{string}", async function (message) {

    let text = await page.innerText('#addToCart');
    return assert.deepEqual(text, message);

});

Then("弹出账单 {string}", async function (bill) {
    await Util.delay(1000);
    let text = await page.innerText('.total');
    return assert.deepEqual(text, bill);

});

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
    }
    this.total = this.total ? this.total : 0;
    let addBtn = await page.$('#addToCart');
    for (let i = 0; i < count; i++) {
        await sleep();
        console.log(`[value = "${itemList[itemName].value}"]`)
        await page.selectOption('select', `${itemList[itemName].value}`)
        if(await addBtn.innerText() !== "Sold Out"){
            await addBtn.click();
            this.total += itemList[itemName].price;
        }else{
            console.log(`${itemName} sold out.`)
        }
    }
});

Then("验证购物车总价符合预期", async function () {
    let text = await page.innerText('.total');
    let cartTotal = Number(text.split('$')[1]);
    let expectTotal = this.total.toFixed(2);    
    assert.deepEqual(cartTotal, expectTotal);
    this.attach(`预期价格为${expectTotal}，实际价格为${cartTotal}`)
});

async function sleep(){
    const INTERVAL = 300;
    await Util.delay(INTERVAL);    
}