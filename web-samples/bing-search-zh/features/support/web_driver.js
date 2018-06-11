require('chromedriver');
const webDriver = require('selenium-webdriver');

//create WebDriver instance based on your browser config;
function createDriver() {
    let browserConfig = process.env.BROWSER || 'chrome';
    let browser = browserConfig.toLowerCase();
    if (['chrome', 'firefox', 'ie'].indexOf(browser) < 0) browser = 'chrome'; //default to chrome
    return new webDriver.Builder().forBrowser(browser).build();
}

exports.driver = createDriver();