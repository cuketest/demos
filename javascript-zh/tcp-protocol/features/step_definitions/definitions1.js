const assert = require('assert');
const { BeforeAll, AfterAll, Given, When, Then } = require('cucumber');
const { readFileSync } = require('fs')
const { fork } = require('child_process');
const TCPClient = require('../support/client')
//// 你的步骤定义 /////
let sub;
BeforeAll(async function () {
    sub = fork('./features/support/server.js');
})
AfterAll(async function () {
    sub.kill()
})

Given("发送文本{string}并检验", async function (str) {
    let tcp = new TCPClient();
    let response = await tcp.send(str); 
    assert.deepStrictEqual(response, str); 
    this.attach(`发送数据为字符串"${str}"，接收数据为${response}`);

});

Given("发送数字{int}并检验", async function (num) {
    let tcp = new TCPClient();
    let response = await tcp.send(num);
    assert.deepStrictEqual(parseInt(response, 10), num);
    this.attach(`发送数据为数字${num}，接收数据为${response}`);

});

Given("发送{string}文件并检验", async function (filename) {
    let content = readFileSync(filename, {encoding: 'utf-8'});
    let tcp = new TCPClient();
    let response = await tcp.send(content);
    assert.deepStrictEqual(response, content);
    this.attach(`发送的文件内容为${content}，接收数据为${response}`);
});