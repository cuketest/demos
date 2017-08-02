///// Your step definitions /////
// use this.Given(), this.When() and this.Then() to declare step definitions
var driver = require('../support/world').driver;
module.exports = function () {
    this.Given(/^open the browser$/, function () {
        return this.driver.get('https://cuketest.github.io/apps/shopping-cart/');
    });
    this.When(/^I click Add to Cart btn$/, function () {
        return this.driver.findElement({ xpath: '//*[@id=\'flux-cart\']/div/div[2]/div/button' }).click();
    });
    this.Then(/^Add to Cart button should be Sold Out$/, function () {
        // Write code here that turns the phrase above into concrete actions
        return this.driver.findElement({ xpath: '//*[@id=\'flux-cart\']/div/div[2]/div/button' }).getText().then(function (text) {
            return text === 'Sold Out';
        });
    });
    this.Then(/^the total should be "([^"]*)"$/, function (arg1) {
        // Write code here that turns the phrase above into concrete actions
        return this.driver.findElement({ xpath: '//*[@id=\'flux-cart\']/div/div[1]/div/span' }).getText().then(function (text) {
            return text === arg1;
        });
    });   
};