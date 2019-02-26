const { Given, When, Then } = require('cucumber');
const { model } = require('../support/win_driver');
const { Util } = require('leanpro.common');

Given(/^打开Outlook桌面客户端$/, async function () {
    await model.getButton("开始").click(0, 0, 1);
    await Util.delay(2000);
    await model.getListItem("Mail").click(0, 0, 1);

});

When(/^点击新建邮件$/, async function () {
    await Util.delay(2000);
    await model.getButton("New mail").click(0, 0, 1);
});

When(/^在收件人，主题，收件内容中输入对应的信息$/, async function () {
    await model.getEdit("To:").clearAll();
    await model.getEdit("To:").set("carolseaver1@outlook.com");

    await model.getEdit("Subject").clearAll();
    await model.getEdit("Subject").set("培训大纲");

    let content = "hi,Carol:{ENTER}请把本次培训内容发送给我好吗？{ENTER}Jason Seaver"

    await model.getDocument("消息").clearAll();
    await model.getDocument("消息").set(content);
});

When(/^点击发送邮件$/, async function () {
    await model.getButton("Send").click(0, 0, 1);
    await Util.delay(1000)
});