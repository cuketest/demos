const { Util } = require('leanpro.common');
///// Your step definitions /////
// use this.Given(), this.When() and this.Then() to declare step definitions
var { Given, When, Then } = require('cucumber')
let { until } = require('selenium-webdriver')
let { driver } = require('../support/web_driver')
var assert = require('assert')

let defaultuntiltime = 60*1000;
Given(/^open the url "([^"]*)"$/, function (url) {
    return driver.get(url);
});

//scenario Shopping
When(/^I click "([^"]*)"$/, function (arg1) {
    //Pay parking
    let ele = driver.wait(until.elementLocated({ partialLinkText: arg1 }), defaultuntiltime);
    return ele.click();
});

Then(/^I should get the "([^"]*)" page$/, function (arg1) {
    let page = driver.wait(until.elementLocated({ css: 'main > div.topo-fixo.z-depth-1 > div > h5' }), defaultuntiltime)
    return page.getText().then((text) => {
        return assert.deepEqual(text, arg1);
    })
});

Then(/^I click the Número do Ticket$/, async function () {
    //Ticket number

    let codigo = driver.wait(until.elementLocated({ id: "codigo" }), defaultuntiltime)
    await Util.delay(1000);
    return codigo.click();
});

Then(/^I input keyword "([^"]*)" of Número do Ticket$/, function (arg1) {
    let codigo = driver.wait(until.elementLocated({ id: 'codigo' }), defaultuntiltime);
    return codigo.sendKeys(arg1);
});

Then(/^I click Cartão de crédito$/, function () {
    //Credit card
    let creditcard = driver.wait(until.elementLocated({ id: "cardnumber" }), defaultuntiltime);
    return creditcard.click();
});

Then(/^I input keyword "([^"]*)" of Cartão de crédito$/, function (cardNumber) {
    let cardNum = driver.wait(until.elementLocated({ id: "cardnumber" }), defaultuntiltime);
    return cardNum.sendKeys(cardNumber);
});

Then(/^I click Vencimento$/, function () {
    let vencimento = driver.wait(until.elementLocated({ css: 'form > div > div.input-field.col.s4 > label' }), defaultuntiltime);
    return vencimento.click();
});

Then(/^I input keyword "([^"]*)" of Vencimento$/, function (arg1) {
    let expdate = driver.wait(until.elementLocated({ id: 'exp-date' }), defaultuntiltime);
    return expdate.sendKeys(arg1);
});

Then(/^I input keyword "([^"]*)" of Código$/, function (cvc) {
    let cvcele = driver.wait(until.elementLocated({ id: "cvc" }), defaultuntiltime);
    return cvcele.sendKeys(cvc);
});
Then(/^I click Código$/, function () {
    let codigoinput = driver.wait(until.elementLocated({ css: 'form > div > div.input-field.col.s3 > label' }), defaultuntiltime);
    return codigoinput.click();
});

Then(/^I click the button of Pagar$/, function () {
    let paga = driver.wait(until.elementLocated({ css: 'main > div.row.card-panel > form > button' }), defaultuntiltime);
    return paga.click();
});

Then(/^I should get the page "([^"]*)"$/, function (arg1) {
    let page = driver.wait(until.elementLocated({ css: 'main > div.section.white > div > h2' }), defaultuntiltime);
    return page.getText().then((text) => {
        return assert.deepEqual(text, arg1);
    });
});

Then(/^I click Back button$/, function () {
    let backbtn = driver.wait(until.elementLocated({ css: 'div.parallax-container > a > i' }), defaultuntiltime);
    return backbtn.click();
});

When(/^I should get the new tab window "([^"]*)"$/, function (url) {
    let self = driver;
    driver.sleep(10000)
    return driver.getAllWindowHandles().then(function (handles) {
        self.switchTo().window(handles[parseInt(1)]);

        self.getCurrentUrl().then((currentUrl) => {
            return assert.deepEqual(url, currentUrl)
        })
    });
});

Then(/^I click MODA list$/, function () {
    let modalist = driver.wait(until.elementLocated({ css: 'a[href="#moda"]' }), defaultuntiltime)
    return modalist.click();
});

Then(/^I click Restaurante list$/, function () {
    let modalist = driver.wait(until.elementLocated({ css: 'a[href="#restaurante"]' }), defaultuntiltime)
    return modalist.click();
});
