const cuketest = require('cuketest');
const { BeforeAll, After, setDefaultTimeout } = require('cucumber');
const { QtAuto } = require("leanpro.qt");
const {Util} = require('leanpro.common');
setDefaultTimeout(30 * 1000);  //set step timeout to be 30 seconds
BeforeAll(async function () {
    cuketest.minimize();
    QtAuto.launchQtProcess("/usr/lib/cuketest/bin/dockwidgets");
}) 
After(async function(){
    await Util.delay(2000);
})