const webdriverio = require('webdriverio');

//设置被测应用参数
let options = {
    desiredCapabilities: {
        platformName: "Android",
        deviceName: "9c83590", //设备序列串号 
        // platformVersion: "5.1", //系统平台版本
        appPackage: "com.microsoft.office.outlook", //package 名字
        appActivity: ".MainActivity", //启动activity 名字
        resetKeyboard: true,
        noReset: true,
        unicodeKeyboard: true
    },
    host: "127.0.0.1",
    port: 4723
};

//根据参数配置创建WebDriverIO实例;
function createDriver() {
    const client = webdriverio.remote(options);
    return client;
}

exports.app_driver = createDriver();