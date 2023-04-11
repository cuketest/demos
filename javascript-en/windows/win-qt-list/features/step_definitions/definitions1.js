const { Keyboard } = require('leanpro.common');
const { CukeTest } = require('cuketest');
const { Given, When, Then, BeforeAll, AfterAll, setDefaultTimeout } = require('cucumber');
const { WinAuto } = require('leanpro.win');
const { Util } = require('leanpro.common');
const assert = require('assert');
const path = require('path');
let model = WinAuto.loadModel(__dirname + "/model1.tmodel");
setDefaultTimeout(60 * 1000); //set step timeout to be 60 seconds
let child;
BeforeAll(async function () {
    child = await Util.launchSample('fetchmore.exe'); 
    if (await model.getWindow("Window").exists(5)){
        Keyboard.disableIme(); // Disable input method
        await model.getWindow("Window").restore();
    }  
    else{
        throw new Error("Testing application was not launched.")
    }
    CukeTest.minimize();  // CukeTest minimized
})

AfterAll(async function () {
    await Util.stopProcess(child);  // When debugging, you can comment this line to observe the phenomenon after the end
    CukeTest.restore();
})

//// your step definition /////
Given("Click the target item{string}", async function (itemName) {
    let targetItem = await model.getListItem(itemName);
    await targetItem.click();
    await Util.delay(500);
    let isFocused = await targetItem.focused();
    assert.strictEqual(isFocused, true, `Target item ${itemName} is not selected!`);
});

Given("Select target item{string}", async function (itemName) {
    let targetItem = await model.getListItem(itemName);
    await targetItem.select(); 
    await Util.delay(500);
    let isFocused = await targetItem.focused();
    assert.strictEqual(isFocused, true, `Target item ${itemName} is not selected!`);
});

Given("Use the list method to scroll", async function () {
    let targetList = model.getList("List");
    await targetList.scrollToBottom();
    await Util.delay(1000);
    await targetList.scrollToTop();
});

When("Enter the path in the search box{string}", async function (path) {
    let searchBox = model.getEdit("Directory:");
    await searchBox.set(path);
    assert.strictEqual(await searchBox.value(), path);
    await Util.delay(1000);
    
});

Then("Determine if the target item exists in the search results{string}",async function (itemName) {
    let targetItem = await model.getList('List').findItem(itemName);
    await targetItem.select();
    let actual = await targetItem.value();

    assert.strictEqual(actual, itemName);
    await Util.delay(3000);
});
