var { Given, When, Then } = require('cucumber')
const { Auto } = require('leanpro.win')
const { Util } = require('leanpro.common')
const path = require('path')
const assert = require('assert')
const { driver } = require('../support/web_driver')

Given(/^用户Carol登录Outlook web页面$/, async function () {
    await driver.url("https://outlook.live.com/mail/inbox#");
    await driver.click('div.headerHero>a:last-child');
    await driver.setValue('#i0116', 'carolseaver1@outlook.com');
    await driver.click('#idSIButton9');
    await driver.setValue('#i0118', '密码');
    await driver.waitForEnabled('#idSIButton9', 20 * 1000)
    await driver.click('#idSIButton9');

});

When(/^打开收件箱并打开最新一次的邮件$/, async function () {
    await driver.waitForEnabled('div > div[role="option"] > div[draggable="true"] > div[tabindex="-1"]', 15 * 1000);

    await driver.click('div > div[role="option"] > div[draggable="true"] > div[tabindex="-1"]');
});

Then(/^回复Jason邮件并上传相关文档$/, { timeout: 180 * 1000 }, async function () {
    // await Util.delay(1000);

    let content = `
    hi,Jason:
        附件为本次培训内容大纲。请查收，谢谢。

    Carol Seaver
    `
    let bool = await driver.waitForEnabled('div[tabindex="-1"] > div > button[type="button"]> div >span', 45 * 1000)

    if (bool == true) {
        console.log("get Text ===")
        let text = await driver.getText('div[tabindex="-1"] > div > button[type="button"]> div >span')

        console.log("text == ", text)
        if (text.includes('加载')) {
            console.log('click loading')
            await driver.click('div[tabindex="-1"] > div > button[type="button"]> div >span');
            await Util.delay(1000)
            await driver.click('div[tabindex="-1"] > div > button[type="button"]> div >span')
        } else {
            await driver.click('div[tabindex="-1"] > div > button[type="button"]> div >span')
        }
    }
    // await driver.keys()
    // let input_area = await driver.element('div[dir="ltr"]');
    await driver.waitForExist('div[dir="ltr"]', 20 * 1000);
    await driver.click('div[dir="ltr"]')
    // await driver.clearElement('div[dir="ltr"]')
    await driver.setValue('div[dir="ltr"]', content);

    await driver.waitForEnabled('button[name="附加"]', 20 * 1000);
    await driver.click('button[name="附加"]');
    await Util.delay(500)
    await driver.waitForVisible('button[name="浏览此计算机"]', 20 * 1000);
    await driver.click('button[name="浏览此计算机"]');

    await Util.delay(1500);
    let uplaodFilePane = await Auto.getPane({
        "className": "Chrome_WidgetWin_1",
        "name": "邮件 - Carol Seaver - Outlook - Google Chrome"
    }).getWindow({
        "className": "#32770",
        "title": "打开"
    }).getComboBox({
        "automationId": "1148",
        "name": "文件名(N):"
    }).getEdit({
        "automationId": "1148",
        "name": "文件名(N):"
    })

    let filepath = path.join(__dirname, '..', '..', 'files', '培训大纲.md')
    await uplaodFilePane.clearAll();
    await uplaodFilePane.set(filepath);
    await Auto.getPane({
        "className": "Chrome_WidgetWin_1",
        "name": "邮件 - Carol Seaver - Outlook - Google Chrome"
    }).getWindow({
        "className": "#32770",
        "title": "打开"
    }).getButton({
        "automationId": "1",
        "name": "打开(O)"
    }).click(0, 0, 1);

    await driver.waitForEnabled('div.ms-Button-flexContainer> i[data-icon-name="Send"]', 20 * 1000);
    await driver.click('div.ms-Button-flexContainer> i[data-icon-name="Send"]')
    await Util.delay(500);

});
