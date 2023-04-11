const webdriverio = require('webdriverio');

//设置被测应用参数
let options = {
    hostname: "127.0.0.1",
    port: 4723,
    path: '/wd/hub',
    logLevel: "info",
    capabilities: {
        automationName: "uiautomator2",
        platformName: "Android",
        deviceName: "testPhone", //设备序列串号
        platformVersion: "11.0",//系统平台版本
        appPackage: "io.appium.android.apis", //package 名字
        appActivity: ".ApiDemos", //启动activity 名字
        resetKeyboard: true,
        noReset: true,
        unicodeKeyboard: true
    },
}

//根据参数配置创建WebDriverIO实例;
var client;

async function createDriver() {
    client = await webdriverio.remote(options);
    return client;
}

function getDriver() {
    return client;
}

exports.createDriver = createDriver;
exports.getDriver = getDriver;