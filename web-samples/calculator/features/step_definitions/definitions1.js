///// Your step definitions /////
// use this.Given(), this.When() and this.Then() to declare step definitions
let { Given, When, Then } = require('cucumber')
let { driver } = require('../support/web_driver')
let { By } = require('selenium-webdriver')

let assert = require('assert')

Given("open url {string}", function (arg1) {
    return driver.get(arg1);
});

Then("I click the =", function () {
    return driver.findElement({ linkText: '=' }).click();
});
Then("I should  get the result {string}", function (arg1) {
    driver.findElement({ id: 'calculator-result' }).getText().then(text => {
        return assert.strictEqual(text, arg1);
    });
});
Then("History panel should has {string} text", function (arg1) {
    driver.findElement({ id: 'calc-history-list' }).getText().then(text => {
        return assert.strictEqual(text, arg1);
    });
});
When("I click the {string}", function (arg1) {
    return driver.findElement({ linkText: arg1 }).click();
});

Then("History panel should be null", function () {
    return driver.findElement({ id: 'calc-history-list' }).getText().then(function (text) {
        return assert.strictEqual(text, '');
    });
});

When("I click {int} \+ {int}", function (arg1, arg2) {
    console.log(arg1, arg2)
    driver.findElement(By.css('[data-key="49"]')).click();
    driver.findElement(By.css('[data-constant="SUM"]')).click();
    return driver.findElement(By.css('[data-key="49"]')).click();
});
