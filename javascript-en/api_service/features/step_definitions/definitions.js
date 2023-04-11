
var { Given, When, Then, setDefaultTimeout } = require('cucumber');
var got = require('got');
var assert = require('assert');

setDefaultTimeout(60 * 1000)
var jsonFormat = {
    headers: { 'Content-Type': 'application/json' },
    json: true
};

Given('Get the service api {string} and i should get the {string}', function (url, expectval) {
    return got.get(url, jsonFormat).then(function (result) {
        var data = result.body;
        var assertdata = JSON.parse(expectval);
        return assert.deepEqual(data, assertdata);
    });
});

Given("Post to service api {string} with {string} and I should get the {string}", function (url, data, expectval) {
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

Given("Put to service api {string} with {string} and I should get the {string}", function (url, data, expectval) {
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

Given("Patch to service api {string} with {string} and I should get the {string}", function (url, data, expectval) {
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

Then("Delete to service api {string} and I should get the {string}", function (url, expectval) {
    return got.delete(url, jsonFormat).then(function (result) {
        var data = result.body;
        var assertdata = JSON.parse(expectval);
        return assert.deepEqual(data, assertdata);
    });
});



