const { TestModel } = require("leanpro.win");
let path = require('path');

let tmodelFile = path.join(__dirname, 'Mail.tmodel');
let model = TestModel.loadModel(tmodelFile);

exports.model = model;