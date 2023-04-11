require('chromedriver');
const webdriver = require('selenium-webdriver')

exports.driver = new webdriver.Builder().forBrowser('chrome').build();