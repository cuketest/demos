const { remote } = require('webdriverio');

//设置appium配置信息
const caps = {
    platformName: "Android",
    platformVersion: "10.0", //系统平台版本
    appPackage: "io.appium.android.apis", //package 名字
    appActivity: ".ApiDemos", //启动activity 名字
    resetKeyboard: true,
    noReset: true,
    unicodeKeyboard: true
}

let options = {
    hostname: "127.0.0.1",
    port: 4723,
    path: '/wd/hub',
    logLevel: "info",
    capabilities: caps,
}

//根据参数配置创建WebDriverIO实例;
let client;

async function createDriver() {
    client = await remote(options);
    return client;
}

function getDriver() {
    return client;
}

exports.createDriver = createDriver;
exports.getDriver = getDriver;