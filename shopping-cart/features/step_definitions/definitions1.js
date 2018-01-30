///// Your step definitions /////
// use this.Given(), this.When() and this.Then() to declare step definitions
var { Given, When, Then } = require('cucumber')
let { driver } = require('../support/web_driver')
var assert = require('assert')

Given(/^open the browser$/, function () {
    return driver.get('https://cuketest.github.io/apps/shopping-cart/');
});
When(/^I click Add to Cart btn$/, function () {
    return driver.findElement({ xpath: '//*[@id=\'flux-cart\']/div/div[2]/div/button' }).click();
});
Then(/^Add to Cart button should be Sold Out$/, function () {
    // Write code here that turns the phrase above into concrete actions
    return driver.findElement({ xpath: '//*[@id=\'flux-cart\']/div/div[2]/div/button' }).getText().then(function (text) {
        return text === 'Sold Out';
    });
});
Then(/^the total should be "([^"]*)"$/, function (arg1) {
    // Write code here that turns the phrase above into concrete actions
    return driver.findElement({ xpath: '//*[@id=\'flux-cart\']/div/div[1]/div/span' }).getText().then(function (text) {
        return text === arg1;
    });
});   
