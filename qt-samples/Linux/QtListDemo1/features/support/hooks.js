const { setDefaultTimeout } = require('cucumber');
const { BeforeAll, After } = require('cucumber');
const { Util } = require('leanpro.common');
const { QtModel, QtAuto } = require('leanpro.qt');
const model = QtModel.loadModel(__dirname + "/../step_definitions/model1.tmodel");
BeforeAll(async function () {
    QtAuto.launchQtProcess("/usr/lib/cuketest/bin/fetchmore"); // 前缀为CukeTest默认的sample路径
})

After(async function () {
    await Util.delay(2000);
    let screenshot = await model.getWindow("Fetch_More_Example").takeScreenshot();
    this.attach(screenshot, 'image/png')
})
setDefaultTimeout(30 * 1000);