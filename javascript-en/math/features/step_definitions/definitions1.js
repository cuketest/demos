
const { Given, When, Then } = require('cucumber');
const lib = require('./lib')
//// Your step definitions /////

Given(/^a variable set to (\d+)$/, async function (num) {
	lib.setTo(num);
});

When(/^I increment the variable by (\d+)$/, async function (num) {
	lib.incrementBy(num);
});

Then(/^the variable should contain (\d+)$/, async function (num) {
	if (lib.variable != parseInt(num)) {
		throw new Error('Variable should contain ' + num +
			' but it contains ' + lib.variable + '.');
	}
});
