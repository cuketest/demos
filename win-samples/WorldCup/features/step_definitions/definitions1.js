
const { Given, When, Then } = require('cucumber');

//// 你的步骤定义 /////
const cuketest = require('cuketest')
const path = require('path')

let modelfile = path.join(__dirname, '../../models/calendar.tmodel')


const { TestModel } = require("leanpro.win");
var model = TestModel.loadModel(modelfile);


Given(/^打开日历客户端$/, async function () {

    await model.getButton("开始").click(0, 0, 1);
    await cuketest.delay(1000)
    await model.getListItem("Calendar星期五15").click(0, 0, 1);

});



When(/^设置如下事件到日历中"([^"]*)","([^"]*)","([^"]*)"$/, async function (day, time, event) {
    event = event.toString();

    await model.getButton(day).click(5, 5, 1);
    await cuketest.delay(1500)
    let is_newEvent = await model.getButton("New event").exist(3);
    if (is_newEvent) {
        await model.getButton("New event").click(0, 0, 1);
    }

    await model.getButton("More details").click(0, 0, 1);
    await cuketest.delay(1000)
    await model.getEdit("Event name").clearAll();
    await model.getEdit("Event name").set(event);
    await cuketest.delay(1000)
    await model.getCheckBox("All day").check(false);
    await cuketest.delay(1000)
    await model.getEdit("Start time1").clearAll();
    await model.getEdit("Start time1").set(time);

    await model.getButton("Save and close").click(0, 0, 1);
    await cuketest.delay(2000)
});

