var webdriverio = require('webdriverio');
// 设置浏览器信息
var options = {
    desiredCapabilities: {
        browserName: 'chrome'
    }
};
//创建driver
function createDriver() {
    return webdriverio.remote(options);
}

exports.driver = createDriver();