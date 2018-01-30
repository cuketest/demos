/**
 * for IE 
 * It needs to set same Security level in all zones. To do that follow the steps below:
 * Open IE
 * Go to Tools -> Internet Options -> Security
 * Set all zones (Internet, Local intranet, Trusted sites, Restricted sites) to the same protected mode, enabled or disabled should not matter.
 * Finally, set Zoom level to 100% by right clicking on the gear located at the top right corner and enabling the status-bar. Default zoom level is now displayed at the lower right.
 */
let { driver } = require('./web_driver')
var { After, Before, AfterAll, BeforeAll } = require('cucumber')

Before(function () {
  console.log('Before....')
})


After(async function () {
  console.log("After......")
  let screenshot = await driver.takeScreenshot()
  this.attach(screenshot, 'image/png')
  await driver.manage().deleteAllCookies();
});

AfterAll(function () {
  // perform some shared teardown
  return driver.quit()
})