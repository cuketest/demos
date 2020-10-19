var { Given, When, Then } = require('cucumber');
var got = require('leanpro.got');
var assert = require('assert');

Given("Get the service api {string} and i should get the {string}", async function (url, expectval) {
    let option = {
        "headers": {
            "content-type": "application/json"
        },
        "json": true
    };
    let res = await got.get(url, option);
    let actual = res.body;
    let expected = JSON.parse(expectval);
    assert.deepEqual(actual, expected);
    this.attach(JSON.stringify(res.body, null, '\t'));
});

Given("Post to service api {string} with {string} and I should get the {string}", async function (url, data, expectval) {
    let option = {
        "headers": {
            "content-type": "application/json"
        },
        "json": true,
        "body": JSON.parse(data)
    };
    let res = await got.post(url, option);
    let actual = res.body;
    let expected = JSON.parse(expectval);
    assert.deepEqual(actual, expected);
    this.attach("使用JSON响应结果为: "+res);
});

Given("Put to service api {string} with {string} and I should get the {string}", async function (url, data, expectval) {
    let option = {
        "headers": {
            "content-type": "application/json"
        },
        "json": true,
        "body": JSON.parse(data)
    };
    let res = await got.put(url, option);
    let actual = res.body;
    let expected = JSON.parse(expectval);
    assert.deepEqual(actual, expected);
});

Given("Patch to service api {string} with {string} and I should get the {string}", async function (url, data, expectval) {
    let option = {
        "headers": {
            "content-type": "application/json"
        },
        "json": true,
        "body": JSON.parse(data)
    };
    let res = await got.patch(url, option);
    let actual = res.body;
    let expected = JSON.parse(expectval);
    assert.deepEqual(actual, expected);
});

Given("Delete to service api {string} and I should get the {string}", async function (url, expectval) {
    let option = {
        "headers": {
            "content-type": "application/json"
        },
        "json": true
    };
    let res = await got.delete(url, option);
    let actual = res.body;
    let expected = JSON.parse(expectval);
    assert.deepEqual(actual, expected);
});
