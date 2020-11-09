const { Given, When, Then } = require('cucumber');
const { AppModel, Auto } = require('leanpro.win');
const { Util } = require('leanpro.common');
const assert = require('assert');
let model = AppModel.loadModel(__dirname + "/model1.tmodel");

//// 你的步骤定义 /////
Given("单击目标项{string}", async function (itemName) {
    let targetItem = await model.getListItem(itemName);
    await targetItem.click(0, 0, 1);
});

When("双击目标项{string}", async function (itemName) {
    let targetItem = await model.getListItem(itemName);
    await targetItem.dblClick(0, 0, 1);
    await Util.delay(100);
    // 判断目标项是否被选中
    let isFocused = await targetItem.focused();
    await Util.delay(1000);
    assert.equal(isFocused, true, "Target item is not selected!");
});

Then("右键目标项{string}并选择操作", async function (itemName) {
    let targetItem = model.getListItem(itemName);
    await targetItem.click(0, 0, 2);
});

Given("使用模拟按键进行滚动和翻页", async function () {
    let targetList = model.getList("List");
    await targetList.click();   // 聚焦目标控件，使模拟按键对控件生效
    await targetList.pressKeys("{PGDN}"); // 使用PageDown按键翻页
    await targetList.pressKeys('{DOWN 10}'); // 使用下箭头向下滚动, 这里按了10次
});

When("使用滚动条按钮进行翻页", async function () {
    // 在模型文件中添加滚动条的测试对象
    let lineUp = model.getButton("Line up");
    let lineDown = model.getButton('Line down')
    let pageUp = model.getButton('Page up');
    let pageDown = model.getButton('Page down');

    await lineDown.click();
    await Util.delay(1000);
    await pageDown.click();
    await Util.delay(1000);
    await lineUp.click();
    await Util.delay(1000);
    await pageUp.click();
    await Util.delay(1000);
});

Then("使用drag与drop方法进行拖拽或滑屏操作", async function () {
    let scrollBlock = model.getGeneric('Position');
    await scrollBlock.drag();
    await scrollBlock.drop(0, 40);
});

Then("使用vScroll和hScroll进行滚动（Qt暂不支持）", async function () {
    let targetList = model.getList('List');
    try {
        await targetList.vScroll(100);
        await targetList.hScroll(100);
    } catch (err) {
        console.warn("Qt不支持vScroll与hScroll方法，提示如下:\nThere is no function named `vScroll` and `hScroll`", err);
    }
});

When("在搜索框中输入路径{string}", async function (path) {
    let searchBox = model.getEdit("Directory:");
    await searchBox.click();
    await searchBox.set(path);
    assert.equal(await searchBox.value(), path);
});

Then("判断搜索结果中是否存在目标项{string}", async function (itemName) {
    let list = await model.getList('List');
    let lastItemName = '';
    let foundFlag = false;
    let name = '';
    await list.click();
    while (true) {
        let items = await list.getControls({ type: 'ListItem' });
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            name = await item.name();
            if (name == itemName) {
                await item.click(1, 1, 1);
                foundFlag = true;
            }
        }
        if (foundFlag) break;
        if (lastItemName == name) {
            throw "List is end, item not found!";
            break;
        }
        lastItemName = name;
        await list.pressKeys('{PGDN}');
    };
    await Util.delay(3000);
});
