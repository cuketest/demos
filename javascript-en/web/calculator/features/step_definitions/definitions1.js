///// Your step definitions /////
// use this.Given(), this.When() and this.Then() to declare step definitions
const { BeforeAll, AfterAll, Given, When, Then, setDefaultTimeout } = require('cucumber');
let assert = require('assert')
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
    await context.close();
});
let page
Given("open url {string}", async function (arg1) {
    page = await context.newPage();
    await page.goto(arg1)
});

Then("I click the =", async function () {
    await page.click('.btn.btn-primary')
});
Then("I should  get the result {string}", async function (arg1) {
    await page.innerText('#calculator-result').then(text => {
        return assert.strictEqual(text, arg1);
    });
});
Then("History panel should has {string} text", async function (arg1) {
    await page.innerText('#calc-history-list').then(text => {
        return assert.strictEqual(text, arg1);
    });
});
When("I click the {string}", async function (arg1) {
    await page.click(`text=${arg1}`)
});

Then("History panel should be null", async function () {
    await page.innerText('#calc-history-list').then(function (text) {
        return assert.strictEqual(text, '');
    });
});

When("I click {int} \+ {int}", async function (arg1, arg2) {
    await page.click('[data-key="49"]')
    await page.click('[data-constant="SUM"]')
    await page.click('[data-key="49"]')
});
