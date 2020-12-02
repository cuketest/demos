const { TestModel } = require('leanpro.win');
const { Util } = require('leanpro.common');
const cuketest = require('cuketest');
const { BeforeAll, AfterAll } = require('cucumber');
const path = require('path');
const model = TestModel.loadModel(__dirname + "\\..\\step_definitions\\model1.tmodel");

let pid = 0;
BeforeAll(async function () {
    pid = await Util.launchProcess(path.join(
        __dirname,
        '..',
        'fetchmore.exe'
    ));
    await Util.delay(1000);
    cuketest.minimize();  // CukeTest最小化
})

AfterAll(async function() {
    await Util.stopProcess(pid);  // 在调试时可以注释这一行观察结束后的现象
    cuketest.restore();
})