'use strict';

module.exports = function Hooks() {
  var driver = require('../support/world').driver;
  // Before All Features
  this.BeforeFeatures(function (event, callback) {
    driver.manage().window().maximize();
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
     
      scenario.attach(new Buffer(screenShot, 'base64'), 'image/png');
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
