///// Your step definitions /////
// use this.Given(), this.When() and this.Then() to declare step definitions
var driver = require('../support/world').driver;
var assert = require('assert');
module.exports = function () {
    this.Given(/^open url "([^"]*)"$/, function (arg1) {
        return this.driver.get(arg1);
    });
    this.When(/^I click (\d+) \+ (\d+)$/, function (arg1, arg2) {
        this.driver.findElement({ linkText: arg1 }).click();
        this.driver.findElement({ linkText: '+' }).click();
        this.driver.findElement({ linkText: arg2 }).click();
    });
    this.Then(/^I click the =$/, function () {
        return this.driver.findElement({ linkText: '=' }).click();
    });
    this.Then(/^I should  get the result "([^"]*)"$/, function (arg1) {
        this.driver.findElement({ id: 'calculator-result' }).getText().then(text => {
            return assert.deepEqual(text, arg1);
        });
    });
    this.Then(/^History panel should has "([^"]*)" text$/, function (arg1) {
        this.driver.findElement({ id: 'calc-history-list' }).getText().then(text => {
            return assert.deepEqual(text, arg1);
        });
    });
    this.When(/^I click the "([^"]*)"$/, function (arg1) {
        return this.driver.findElement({ linkText: arg1 }).click();
    });
    
    this.Then(/^History panel should be null$/, function () {
        return this.driver.findElement({ id: 'calc-history-list' }).getText().then(function (text) {
            return assert.deepEqual(text, '');
        });
    });
};