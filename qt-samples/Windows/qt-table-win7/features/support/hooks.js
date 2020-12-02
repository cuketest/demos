const { Util } = require('leanpro.common');
const { AfterAll, BeforeAll } = require('cucumber');
const cuketest = require('cuketest');
BeforeAll(async function () {
    Util.launchProcess(__dirname + "\\" + "..\\samples\\spreadsheet.exe");
    cuketest.minimize();
})
AfterAll(async function () {
    cuketest.restore();
})