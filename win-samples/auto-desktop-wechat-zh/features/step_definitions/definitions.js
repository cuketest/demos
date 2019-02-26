let path = require('path');
const assert = require('assert');
const { BeforeAll, AfterAll, setDefaultTimeout, After, Given, When, Then } = require('cucumber');
const { TestModel, Auto } = require('leanpro.win');
const { Util } = require('leanpro.common');
const puppeteer = require('puppeteer');

let model = TestModel.loadModel(__dirname + "/model1.tmodel");

let browser, page;
setDefaultTimeout(15 * 1000);

BeforeAll(async () => {
    browser = await puppeteer.launch();
    // browser = await puppeteer.launch({headless:false,defaultViewport:{width:1366,height:768},slowMo:255});
    page = await browser.newPage();
})

AfterAll(async () => {
    await browser.close();
})

After(async () => {
    let image = await page.screenshot();
    this.attach(image, 'image/png');
})


Given(/^浏览到搜索网站 "([^"]*)"$/, async function (url) {
    await page.goto(url);
});

When(/^输入框中输入"([^"]*)",并点击搜索按钮$/, async function (text) {
    await page.type('#sb_form_q', text);
    await page.waitFor('#sb_form_go');
    await page.click("#sb_form_go");
});

Then(/^搜索结果中应包含"([^"]*)"$/, async function (key) {
    await page.waitFor('#b_results');
    let content = await page.$eval('#b_results', el => el.innerText);
    assert.ok(content.include(key));
});

Given(/^使用puppeteer打开"([^"]*)"$/, async function (url) {
    await page.goto(url, { waitUntil: 'networkidle2' });
});

let year = new Date().getFullYear();
let month = new Date().getMonth();
let day = new Date().getDate();
let hdpath = path.join(__dirname, '..', '..', year + '_' + month + '_' + day + 'HackerNews.pdf')

Given(/^将当前页面内容保存为到PDF文件中$/, async function () {
    await page.pdf({ path: hdpath, format: 'A4' });
});

Given(/^打开微信群,选择文档$/, async function () {
    await model.getVirtual("发送文件").click();
});

When(/^打开pdf文件$/, async function () {
    await model.getEdit("文件名(N):1").set(hdpath);
    await model.getGeneric("打开(O)").click();
});

When(/^点击发送，发送给群友$/, async function () {
    await model.getVirtual("发送").click();
});