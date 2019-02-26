const { Given, When, Then } = require('cucumber')
const { Util } = require('leanpro.common')
const { app_driver } = require('../support/mobile_driver')

Given(/^打开手机端Outlook$/, async function () {
    // 手机客户端接收邮件需要5-10秒的延迟
    await Util.delay(5000);
    return true;
});

When(/^打开收件箱窗口$/, async function () {
    await app_driver.click('~打开导航抽屉');
    await app_driver.click('android=new UiSelector().resourceId("com.microsoft.office.outlook:id/drawer_item_title").index(1).text("收件箱")');
});

Then(/^打开未读邮件$/, async function () {
    await app_driver.waitForExist('android=new UiSelector().resourceId("com.microsoft.office.outlook:id/message_snippet_frontview").index(0).className("android.widget.LinearLayout")', 20 * 1000);
    await app_driver.click('android=new UiSelector().resourceId("com.microsoft.office.outlook:id/message_snippet_frontview").index(0).className("android.widget.LinearLayout")');
}); 
Then(/^答复框内回复对应内容并发送$/, async function () {
    let loctor = 'new UiSelector().text("答复").index(1)';
    await app_driver.click('android=' + loctor);
    await app_driver.clearElement('~邮件正文。');
    let content = `
    Hi,Jason:
        培训内容文档在我公司PC上保存，现在我在外边，稍后我到公司回复您。
    
    Carol Seaver
    `
    await app_driver.setValue('~邮件正文。', content);
    await app_driver.click('~发送');

});