const { setDefaultTimeout, Before, BeforeAll, After, AfterAll } = require('cucumber')
const cuketest = require('cuketest')

setDefaultTimeout(10 * 1000);

BeforeAll(async function () {
    await cuketest.minimize();
});

AfterAll(async function () {
    await cuketest.maximize();
});