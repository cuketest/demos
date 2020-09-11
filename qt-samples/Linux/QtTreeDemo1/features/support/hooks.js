const cuketest = require('cuketest');
const { After, AfterAll, BeforeAll, setDefaultTimeout } = require('cucumber');
const { QtAuto } = require("leanpro.qt");
const {Util} = require('leanpro.common');
setDefaultTimeout(30 * 1000);  //set step timeout to be 30 seconds
BeforeAll(async function () {
    cuketest.minimize();
    QtAuto.launchQtProcess("/usr/lib/cuketest/bin/dirview");
})
After(async function () {
    await Util.delay(2000);
})
AfterAll(async function () {
    cuketest.restore();
    cuketest.maximize();
})