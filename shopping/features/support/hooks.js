/**
 * for IE 
 * It needs to set same Security level in all zones. To do that follow the steps below:
 * Open IE
 * Go to Tools -> Internet Options -> Security
 * Set all zones (Internet, Local intranet, Trusted sites, Restricted sites) to the same protected mode, enabled or disabled should not matter.
 * Finally, set Zoom level to 100% by right clicking on the gear located at the top right corner and enabling the status-bar. Default zoom level is now displayed at the lower right.
 */
'use strict';

module.exports = function Hooks() {
  var driver = require('../support/world').driver;
  // Before All Features
  this.BeforeFeatures(function (event, callback) {
    
    // driver.manage().window().maximize();  //firefox maximize() error https://github.com/mozilla/geckodriver/issues/820
    driver.executeScript(function(){
      return {
          width: window.screen.availWidth,
          height: window.screen.availHeight
      };
    }).then(function(result){
      driver.manage().window().setSize(result.width, result.height);
    })
    callback();
  })
  // Before Feature
  this.BeforeFeature(function (event, callback) {

    callback();
  });
  //Before Scenario 
  this.BeforeScenario(function (event, callback) {

    callback();
  });
  // Before Step
  this.BeforeStep(function (event, callback) {

    callback();
  });
  // After Step
  this.AfterStep(function (event, callback) {

    callback();
  });

  this.After(function (scenario) {
   return driver.takeScreenshot().then(function (screenShot) {
      return scenario.attach(new Buffer(screenShot, 'base64'), 'image/png');
    });
    
  });
  // After Scenario
  this.AfterScenario(function (event, callback) {

    callback();
  })
  // After Feature
  this.AfterFeature(function (event, callback) {

    callback();
  })
  // After All Features
  this.AfterFeatures(function (event) {
    return driver.quit();
  })

};
