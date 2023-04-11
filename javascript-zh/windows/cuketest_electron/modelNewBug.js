const { Util } = require('leanpro.common');
const { _electron: electron } = require('leanpro.web');

(async () => {
  const browser = await electron.launch({
    args: ["--no-qt"],
    executablePath: "C:\\Program Files\\LeanPro\\CukeTest\\Cuke.exe",
    timeout: 20000
  });

  // Open new page
  const page = await browser.firstWindow();
  // await Util.delay(10000)
  // Click text=ProjectAll
    await page.click('.recent ul li a');

  // Click .glyphicon.glyphicon-modal
  // 拆分写法：
  // await page.click('.glyphicon.glyphicon-modal');
  // const page1 = await browser.waitForEvent("window");
  const [page1] = await Promise.all([
    browser.waitForEvent("window"),
    page.click('.glyphicon.glyphicon-modal'),
  ])
  await page1.waitForLoadState()
  // await Util.delay(4000);

  await page1.click('.fas-addnewfile');

  // await page1.click('[title="新建模型"]');

  // await page1.click('.fas-openfolder');

  // await page1.click('[title="打开"]');

  

//   // Click .fa.fas-locator-image
//   await page1.click('.fa.fas-locator-image');

//   // Open new page
//   const page2 = await browser.firstWindow();

//   // Click #screen >> :nth-match(div, 2)
//   await page2.click('#screen >> :nth-match(div, 2)');

//   // Click .fa.fas-locator-image
//   await page1.click('.fa.fas-locator-image');

//   // Open new page
//   const page3 = await browser.firstWindow();

//   // Click #screen >> :nth-match(div, 2)
//   await page3.click('#screen >> :nth-match(div, 2)');

//   // Click text=pattern
//   await page1.click('text=pattern');

//   // Click text=控件操作
//   await page1.click('text=控件操作');

//   // Click text=click
//   await page1.click('text=click');

//   // Click text=dblClick
//   await page1.click('text=dblClick');

//   // Click text=控件截屏
//   await page1.click('text=控件截屏');

//   // Click .fa-md.fas-openwindow
//   await page1.click('.fa-md.fas-openwindow');

//   // Click [aria-label="Close"] >> text=×
//   page1.once('dialog', dialog => {
//     console.log(`Dialog message: ${dialog.message()}`);
//     dialog.dismiss().catch(() => {});
//   });
//   await page1.click('[aria-label="Close"] >> text=×');

//   // Click .fa.fas-save
//   await page1.click('.fa.fas-save');

//   // Click #toolbar-save-all-btn span
//   page.once('dialog', dialog => {
//     console.log(`Dialog message: ${dialog.message()}`);
//     dialog.dismiss().catch(() => {});
//   });
//   await page.click('#toolbar-save-all-btn span');

//   // ---------------------
//   await browser.close();
})();