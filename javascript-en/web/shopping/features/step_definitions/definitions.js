const { Util } = require('leanpro.common');
let { BeforeAll, AfterAll, Given, When, Then, setDefaultTimeout } = require('cucumber')
let assert = require('assert')
const { chromium } = require('leanpro.web');

// Set the timeout for steps to 60 seconds
setDefaultTimeout(60 * 1000);
let browser, context, page;

// Before all tests, launch the browser and create a new browser context
BeforeAll(async function () {
    browser = await chromium.launch({
        // executablePath: "/usr/bin/lbrowser",
        headless: false
    });
    context = await browser.newContext();
    page = await context.newPage();

});

// After all tests, clean up the session and close the browser
AfterAll(async function () {
    // Clear the session and close the browser
    // ---------------------
    await context.close();
});

// {string} placeholder to receive a string parameter passed to the variable url
Given("open the browser and navigate to {string}", async function (url) {
    // Navigate to the specified URL with a timeout of 60 seconds
    await page.goto(url);

    // Assert if the page title matches the specified value
    let pageTitle = await page.title();
    return assert.equal(pageTitle, "Flux Cart");
})

When("Click the Add to Cart button", async function () {
    await page.click("#addToCart");
});

Then("Add to Cart button should be {string}", async function (message) {

    let text = await page.innerText('#addToCart');
    return assert.deepEqual(text, message);

});

// {string} placeholder to receive a string parameter passed to the variable message
Then("the total should be {string}", async function (bill) {
    await Util.delay(1000);
    let text = await page.innerText('.total');

    // Assert text == message
    return assert.deepEqual(text, bill);

});

// {int} placeholder to receive an integer parameter passed to the variable count, {string} placeholder to receive a string parameter passed to the variable itemName
When("Add {int} {string} to cart", async function (count, itemName) {
    // Item info which matching the option in page.
    const itemList = {
        '40oz Bottle': {
            value: 0, price: 4.99
        },
        '6 Pack': {
            value: 1, price: 12.99
        },
        '30 Pack': {
            value: 2, price: 19.99
        }
    }

    // If total price does not exist, initialize it to 0
    this.total = this.total ? this.total : 0;

    // Loop to add items to the cart
    let addBtn = await page.$('#addToCart');
    for (let i = 0; i < count; i++) {
        await sleep();
        console.log(`[value = "${itemList[itemName].value}"]`)
        await page.selectOption('select', `${itemList[itemName].value}`)
        if (await addBtn.innerText() !== "Sold Out") {
            await addBtn.click();
            this.total += itemList[itemName].price;
        } else {
            console.log(`${itemName} sold out.`)
        }
    }
});

Then("Verify that the cart total price is as expected", async function () {
    let text = await page.innerText('.total');
    let cartTotal = Number(text.split('$')[1]);
    let expectTotal = this.total.toFixed(2);
    assert.deepEqual(cartTotal, expectTotal);
    this.attach(`预期价格为${expectTotal}，实际价格为${cartTotal}`)
});

async function sleep() {
    const INTERVAL = 300;
    await Util.delay(INTERVAL);
}