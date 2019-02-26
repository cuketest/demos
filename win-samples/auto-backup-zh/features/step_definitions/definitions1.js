const path = require('path');
let fs = require('fs');
const { Given, When, Then } = require('cucumber');
const { TestModel, Auto } = require('leanpro.win');
const { Util } = require('leanpro.common');

let model = TestModel.loadModel(__dirname + "/model1.tmodel");


//// 你的步骤定义 /////

let backpath;

Given(/^将"([^"]*)" 目录作为需要备份的目录。$/, async function (dirpath) {
    backpath = path.join(dirpath);
});

let filestring = '';
Given(/^获取此目录下所有文件。$/, async function () {
    let moment = require('moment')
    let date = moment().format('YYYY-MM-DD');
    let dir = path.join('d:\\backups');
    let files = fs.readdirSync(dir);
    console.log(files);
    for (let i = 0; i < files.length; i++) {
        filestring += '"' + files[i] + '" '
    }

    console.log(filestring);
});

Then(/^将此目录文件上传到百度网盘。$/, async function () {
    await model.getVirtual("上传").click();
    await model.getEdit("文件名(N):1").clearAll();
    await model.getEdit("文件名(N):1").set(backpath);
    await model.getButton("存入百度网盘").click();
    await model.getEdit("文件名(N):1").set(filestring);
    console.log(filestring)
    await model.getButton("存入百度网盘").click();
});