const { After, BeforeAll, Before, AfterAll, setDefaultTimeout } = require('cucumber');
const { createDriver, getDriver } = require('./get_driver');


//设置缺省超时时间
setDefaultTimeout(60 * 1000);

BeforeAll(async function () {
    await createDriver();
})

//Before Scenario Hook
Before(async function () {
})

//After Scenario Hook
After(async function () {
    //每个场景结束时截屏
    let screenshot = await getDriver().saveScreenshot("reports/screenShot.png");
    this.attach(screenshot, 'image/png');
});

AfterAll(async function () {
    //关闭应用
    await getDriver().deleteSession();
})

