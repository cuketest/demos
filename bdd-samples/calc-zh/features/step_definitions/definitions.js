
const { defineSupportCode } = require('cucumber')
const assert = require('assert')
const Calculator = require('../../calc');

var calc = new Calculator();

defineSupportCode(function ({ Given, When, Then }) {
    Given(/^我已经在计算器里输入(\d+)$/, function (arg1) {
        calc.push(arg1);
    });

    When(/^我按"([^"]*)"按钮$/, (op) => {
        if (op == '相加') {
            this.result = calc.calc('add');
        }
    });

    Then(/^我应该在屏幕上看到的结果是(\d+)$/, (arg1) => {
        assert.equal(this.result, arg1, 'expect ' + arg1 + ', get ', this.result);
    });

    Then(/^按"([^"]*)"$/, function (arg1) {

    });

})