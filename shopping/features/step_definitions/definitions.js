
var { Given, When, Then } = require('cucumber')
let { driver } = require('../support/web_driver')
var assert = require('assert')

Given(/^open the browser$/, function () {
    return driver.get('https://cuketest.github.io/apps/shopping-cart/');
})

When(/^I click Add to Cart btn$/, function () {
    return driver.findElement({ xpath: '//*[@id=\'flux-cart\']/div/div[2]/div/button' }).click();
});

Then(/^Add to Cart button should be Sold Out$/, function () {
    return driver.findElement({ xpath: '//*[@id=\'flux-cart\']/div/div[2]/div/button' }).getText().then(function (text) {
        return assert.deepEqual(text, 'Sold Out');
    });
});

Then(/^the total should be "([^"]*)"$/, function (arg1) {
    return driver.findElement({ xpath: '//*[@id=\'flux-cart\']/div/div[1]/div/span' }).getText().then(function (text) {
        return assert.deepEqual(text, arg1);
    });
});

Given(/^open new tab"([^"]*)"$/, function (arg1) {
    return driver.get(arg1)
});

When(/^click Download$/, function () {
    return driver.findElement({ css: '#particles > div > a' }).click();
});

Then(/^switch to current window$/, function () {
    const self = driver;
    var winHandleBefore = driver.getWindowHandle();
    return driver.getAllWindowHandles().then(function (handles) {
        return self.switchTo().window(handles[parseInt(0)]);
    });
});

Given(/^open new tab'([^"]*)'$/, function (arg1) {
    return driver.get(arg1)
});
