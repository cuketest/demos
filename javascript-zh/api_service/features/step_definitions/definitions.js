
var { Given, When, Then, setDefaultTimeout } = require('cucumber');
var got = require('got');
var assert = require('assert');

setDefaultTimeout(60 * 1000)

var jsonFormat = {
    headers: { 'Content-Type': 'application/json' },
    json: true
};

Given("发送Get请求 {string} 服务器应该返回数据 {string}", async function (url, expectval) {
    return got.get(url, jsonFormat).then(function (result) {
        var data = result.body;
        var assertdata = JSON.parse(expectval);
        return assert.deepEqual(data, assertdata);
    });
});


Given("发送Post请求 {string} 请求数据为 {string} 服务器应该返回结果 {string}", async function (url, data, expectval) {
    var option = {
        headers: { 'Content-Type': 'application/json' },
        json: true,
        body: JSON.parse(data)
    };
    return got.post(url, option).then(function (res) {
        var data = res.body;
        var assertdata = JSON.parse(expectval);
        return assert.deepEqual(data, assertdata);
    });
});

Given("发送Put请求 {string} 请求数据为 {string} 服务器应该返回结果{string}", async function (url, data, expectval) {
    var option = {
        headers: { 'Content-Type': 'application/json' },
        json: true,
        body: JSON.parse(data)
    };
    return got.put(url, option).then(function (res) {
        var data = res.body;
        var assertdata = JSON.parse(expectval);
        return assert.deepEqual(data, assertdata);
    });
});

Given("发送Patch请求{string} 请求数据为 {string} 服务器应该返回结果 {string}", async function (url, data, expectval) {
    var option = {
        headers: { 'Content-Type': 'application/json' },
        json: true,
        body: JSON.parse(data)
    };
    return got.patch(url, option).then(function (res) {
        var data = res.body;
        var assertdata = JSON.parse(expectval);
        return assert.deepEqual(data, assertdata);
    });
});

Then("发送delete请求到{string} 应该得到结果 {string}", async function (url, expectval) {
    return got.delete(url, jsonFormat).then(function (result) {
        var data = result.body;
        var assertdata = JSON.parse(expectval);
        return assert.deepEqual(data, assertdata);
    });
});



