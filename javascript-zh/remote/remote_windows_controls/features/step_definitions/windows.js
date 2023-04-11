const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { CukeTest } = require('cuketest');
const { Given, When, Then, setDefaultTimeout } = require('cucumber');
const { BeforeAll, Before, After, AfterAll, setDefinitionFunctionWrapper } = require('cucumber');

setDefaultTimeout(60 * 1000); //set step timeout to be 60 seconds
let root_dir = path.join(__dirname, '../../', 'images');
let app_path;
if (!fs.existsSync(root_dir)) {
    fs.mkdirSync(root_dir)
}
let pid = 0;

let auto, RunSettings, WinAuto, Util, Screen, model;
/* Hook函数 */
{
    BeforeAll(async function () {
        auto = await CukeTest.connect({
            //修改远程IP地址
            wsEndpoint: 'ws://127.0.0.1:3131/ws'
        });
        let capabilities = await auto.capabilities();
        console.log("Worker端信息", capabilities);

        RunSettings = auto.runSettings;
        RunSettings.set({slowMo: 0}); //修改慢动作设置

        WinAuto = auto.winAuto;
        Util = auto.util;
        Screen = auto.screen;

        model = await WinAuto.loadModel(__dirname + "/model1.tmodel");

        //自带样例
        app_path = path.join(capabilities.homePath, 'bin/SimpleStyles.exe');
        
        pid = await Util.launchProcess(app_path);
        await model.getWindow("Window").maximize();
        await Util.delay(1000);
        // await CukeTest.minimize();
    })

    Before(async function () {
    })

    After(async function (testCase) {
        // 在每个场景结束时截图
        let filePath = path.join(root_dir, "场景-" + testCase.pickle.name + ".png")
        let screenshot = await Screen.takeScreenshot(filePath);
        this.attach(screenshot, 'image/png');
    });

    AfterAll(async function () {
        await Util.stopProcess(pid);
        await CukeTest.restore();
    })
}
setDefinitionFunctionWrapper(function (fn) {
    if (true) {
        // 需要在步骤前后执行的动作
        return async function () {
            // 在步骤前执行的动作
            // ...
            await fn.apply(this, arguments)
            // 在步骤后执行的动作
            // ...
            // 反注释以下代码为步骤增加1秒间隔
            // await Util.delay(1000);
        }
    }
    else { // 不执行任何操作，单纯执行步骤本身
        return fn
    }
})

// CukeTest的控件操作会自动的重试
// 因此脚本中所加的延时函数Util.delay()是为了便于观察现象
/* 窗口控件 */
{
    When("激活应用窗口", async function () {
        await model.getWindow("Window").activate();
    });

    When("最大化应用窗口", async function () {
        await model.getWindow("Window").maximize();
    });

    Then("最小化应用窗口", async function () {
        await model.getWindow("Window").minimize();
        await Util.delay(2000);
    });
    Then("恢复应用窗口", async function () {
        await model.getWindow("Window").restore();
    });

    Then("关闭应用窗口", async function () {
        // await model.getWindow("Window", {"index": 1}).close();
    });
}

/* 按钮控件 */
{
    Then("判断是否存在", async function () {
        let bool = await model.getButton("Default").exists(1);
        return assert.strictEqual(bool, true);
    });

    When("点击Default按钮", async function () {
        await model.getButton("Default").click(0, 0, 1);

    });

    Then("双击Normal按钮", async function () {
        await model.getButton("Normal").dblClick();
    });


    Then("获取button的name属性值应该为{string}", async function (name) {
        let nameval = await model.getButton("Default").property('name');
        return assert.strictEqual(nameval, name);
    });

    When("获取button控件所有属性", async function () {
        const stepThis = this;
        const control = model.getButton("Default");
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");
    });
}

/* 复选框控件 */
{
    Then("勾选Normal复选框", async function () {
        await model.getCheckBox("Normal1").check(true);
        let checked = await model.getCheckBox("Normal1").checkState();
        assert.equal(checked, true);
    });

    When("判断checked控件已经被选中", async function () {
        await model.getCheckBox("Checked").check(true);
        let checkState = await model.getCheckBox("Checked").checkState();
        return assert.equal(checkState, true)
    });

    Then("取消选中checked控件", async function () {
        await model.getCheckBox("Checked").check(false);
        let checkState = await model.getCheckBox("Checked").checkState();
        return assert.equal(checkState, false);
    });

    When("获取checked控件特有属性", async function () {
        const control = model.getCheckBox("Checked");
        let result = {};
        result["checkState"] = await control.checkState();
        this.attach(JSON.stringify(result,null,'\t'), "application/json");
	});

    When("获取checked控件所有属性", async function () {
        // 获取Text属性的时候会报Error 的错误。
        const control = model.getCheckBox("Checked");
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr, null, '\t'), "application/json");
    });
}

/* 输入框控件 */
{
    When("清空文本内容", async function () {
        await model.getEdit("Edit").clearAll();
    });

    Then("输入文本内容{string}", async function (val) {
        await model.getEdit("Edit").set(val);
        await model.getEdit("Edit1").click();
        let editContent = await model.getEdit("Edit").value();
        assert.strictEqual(editContent, val, `值不为"${val}"，是否被输入法影响了？`)
    });

    Then("使用presskey输入特殊键", async function () {
        await model.getEdit("Edit").click(0, 0, 1);
        await model.getEdit("Edit").pressKeys("^a");
        await model.getEdit("Edit").pressKeys("{BS}");
        let blankContent = await model.getEdit("Edit").text();
        assert.strictEqual(blankContent, '', "输入框内容没有全部删除");
    });

    When("获取edittext控件特有属性", async function () {
        const control = model.getEdit("Edit");
        let result = {};
        result["readOnly"] = await control.readOnly();
        this.attach(JSON.stringify(result,null,'\t'), "application/json");
	});

    When("获取edittext控件所有属性", async function () {
        const control = model.getEdit("Edit");
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");
    });
}

/* 单选框控件 */
{
    When("选中RadioButton", async function () {
        await model.getRadioButton("Checked1").check(true);
        let bool = await model.getRadioButton("Checked1").checked();
        return assert.equal(bool, true);
    });

    When("获取RadioButton控件特有属性", async function () {
        const control = model.getEdit("Checked1");
        let result = {};
        this.attach(JSON.stringify(result,null,'\t'), "application/json");
	});

    When("获取RadioButton控件所有属性", async function () {
        const control = model.getRadioButton("Checked1");
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");
        await control.checked();
    });
}

/* 下拉框控件 */
{
    When("下拉combox控件", async function () {
        await model.getComboBox("ComboBox1").open();
    });

    When("选择{string}选项", async function (choice) {
        // await Util.delay(500);
        await model.getComboBox("ComboBox1").select(choice);
        let selectedName = await model.getComboBox("ComboBox1").selectedName();

        assert.strictEqual(choice, selectedName);
    });

    When("获取Combox控件特有属性", async function () {
        const control = model.getComboBox("ComboBox1");
        let result = {};
        result["options"] = await control.options();
        result["itemCount"] = await control.itemCount();
        result["selectedName"] = await control.selectedName();
        this.attach(JSON.stringify(result,null,'\t'), "application/json");
	});

    When("获取Combox控件所有属性", async function () {
        const control = model.getComboBox("ComboBox1");
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");
    });

    Then("第一个item值应该为{string}", async function (val) {
        let itemval = await model.getComboBox("ComboBox1").options(0);
        return assert.strictEqual(itemval, val);
    });

    Then("combox可编辑控件pressKey值", async function () {
        await model.getComboBox("ComboBox").click(0, 0, 1);
        await model.getComboBox("ComboBox").pressKeys("Hello World!");
    });
}

/* 滑动条控件 */
{
    When("拖拽Slider1", async function () {
        await model.getGeneric("Thumb").drag(0, 0);
        await model.getGeneric("Thumb").drop(80, 0);
        await Util.delay(2000);
    });

    Then("将Slider_Vertical设置为{int}", async function (value) {
        await model.getSlider("Slider_Vertical").setPosition(value);
    });

    When("获取Slider控件特有属性", async function () {
        const control = model.getSlider("Slider1");
        let result = {};
        // Slider特有属性
        result["position"] = await control.position();
        result["maximum"] = await control.maximum();
        result["minimum"] = await control.minimum();
        this.attach(JSON.stringify(result,null,'\t'), "application/json");
	});

    When("获取Slider控件所有属性", async function () {
        const control = model.getSlider("Slider1");
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");

    });
}

/* 列表框控件 */
{
    When("滚动ListBox视图", async function () {

        await model.getList("List").vScroll("PageDown");
        await model.getList("List").vScroll("PageUp");
        await model.getList("List").vScroll("ArrowDown");
        await model.getList("List").vScroll("ArrowUp");

        await model.getList("List").vScroll(50);
        await model.getList("List").wheel(5);
        await model.getList("List").wheel(-5);
    });

    When("选中第{int}个选项", async function (index) {
        let item = await model.getList("List").scrollTo(index);
        let expected = await model.getList("List").itemName(index);
        let itemName = await item.name();
        assert.strictEqual(itemName, expected);
    });

    When("获取ListBox控件特有属性", async function () {
        const control = model.getList("List");
        let result = {};
        result["itemCount"] = await control.itemCount();
        result["columnCount"] = await control.columnCount();
        result["selectedName"] = await control.selectedName();
        this.attach(JSON.stringify(result, null, '\t'), "application/json");
	});

    When("获取ListBox控件所有属性", async function () {
        const control = model.getList("List");
        let attr = await getAllCommonAttr(control);
                this.attach(JSON.stringify(attr, null, '\t'), "application/json");

        // ListBox特有方法
        await control.scrollTo(2);
        await control.columnName(0);
        await control.columnItemValue(2, 0);
        await control.columnCount();
        await control.itemCount();
        await control.selectedName();
    });


    Then("使用scrollTo方法获取子元素属性", async function () {
        let item = await model.getList("List").scrollTo(0);
        assert.strictEqual(await item.name(), 'First Normal Item');
        let val = await model.getList("List").columnName(0);
        assert.strictEqual(val, '');
    });
}

/* 菜单控件 */
{

    Given("展开子元素相关属性", async function () {
        await model.getMenu("Menu").wheel(3);
        await model.getMenu("Menu").select('#0');
        await Util.delay(200);
        await model.getMenuItem("Sub Four1").click(0, 0, 1);
        await Util.delay(200);

    });

    When("获取menu控件特有属性", async function () {

	});

    When("获取menu控件所有属性", async function () {
        const control = model.getMenu("Menu");
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");
    });

    When("获取menuitem控件特有属性", async function () {

	});

    When("获取menuitem控件所有属性", async function () {
        const control = model.getMenuItem("Top One1");
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");
    });

    Then("menuitem操作方法", async function () {
        await model.getMenuItem("Top One1").open();
        await Util.delay(2000)
        await model.getMenuItem("Sub Four1").open();
    });

    Then("manymenu item操作", async function () {
        await model.getMenuItem("Menu with Many Items").open();
        await Util.delay(500);
        await model.getMenuItem("Menu with Many Items").takeScreenshot(root_dir + '/MenuwithManyItems.png');
    });
}

/* 进度条控件 */
{
    When("获取ProgressBar控件特有属性", async function () {

	});

    When("获取ProgressBar控件所有属性", async function () {
        const control = model.getGeneric("ProgressBar");
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");
    });
}

/* 标签页控件 */
{
    Given("Tab控件操作", async function () {
        await model.getTab("Tab").select(1);
        await model.getTab("Tab").select(2);
        await model.getTab("Tab").select(3);
        await model.getTab("Tab").tabNames(1)
    });

    When("获取Tab控件特有属性", async function () {

	});

    When("获取Tab控件所有属性", async function () {
        const control = model.getTab("Tab");
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");

        // Tab控件特有属性
        await control.activeName();
        await control.count();

    });

    Then("Tab控件截屏", async function () {

        await model.getTab("Tab").takeScreenshot(root_dir + '/tab.png');
    });
}

/* 组控件 */
{
    Given("Group控件操作方法", async function () {
        await model.getGeneric("This is the Header").click(0, 0, 1);
    });

    When("获取Group控件特有属性", async function () {

	});

    When("获取Group控件所有属性", async function () {
        const control = model.getGeneric("This is the Header");
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");
    });

    Then("Group控件截图", async function () {
        await model.getGeneric("This is the Header").takeScreenshot(root_dir + '/GroupHeard.png')
    });
}

/* DataGrid控件 */
{
    Given("datagrid控件操作方法", async function () {
        // await model.getDataGrid("DataGrid").cellValue(0, "age");
        // await model.getDataGrid("DataGrid").columnName(0);
    });

    When("获取datagrid控件特有属性", async function () {
        const control = model.getDataGrid("DataGrid");
        await control.rowCount();
        await control.columnCount();
	});

    When("获取datagrid控件所有属性", async function () {
        const control = model.getDataGrid("DataGrid");
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");
    });

    Then("datagrid控件截屏", async function () {

        await model.getDataGrid("DataGrid").takeScreenshot(root_dir + '/Datagrid.png')
    });

    Then("获取DataGrid中{int}行{int}列的单元格值为{string}", async function (row, col, expect) {
        let actual = await model.getDataGrid("DataGrid").cellValue(row, col);
        assert.strictEqual(actual, expect);
    });
    
    When("先获取DataGrid的第{int}行，再获取该行的第{int}列的单元格的值，并为{string}", async function (row, col, expect) {
        let tableRow = await model.getDataGrid("DataGrid").row(row);
        let tableCell = await tableRow.cell(col);
        let actual = await tableCell.value();
        assert.strictEqual(actual, expect);
    });
}

/* 树和树节点控件 */
{

    Then("直接获取TreeItem", async function () {
        let node = ["Top One", "Sub Four"];
        for(let n of node){
            await model.getTree("Tree").getTreeItem(n).expand();
            await Util.delay(600);
            assert.strictEqual(await model.getTreeItem(n).expandState(), 1);
            
        }
        for (let n of node.reverse()) {
            await model.getTree("Tree").getTreeItem(n).collapse();
            await Util.delay(600);
            assert.strictEqual(await model.getTreeItem(n).expandState(), 0);
        }

    });

    Then("展开多级节点", async function () {
        let node = ["Top One", "Sub Four"];
        await model.getTree("Tree").expandTo(node);
    });

    When("获取Tree控件特有属性", async function () {

	});

    When("获取Tree控件所有属性", async function () {
        const control = model.getTree("Tree");
        let node = ["Top One", "Sub Four"];
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");

        // Tree控件特有属性
        await control.itemCheckedStatus(node);
        await control.childCount(node);
        await control.treeNodeText(node);

    });

    Then("执行Tree控件操作", async function () {
        let node = ["Top Two", "Checkable"];
        await model.getTree("Tree").expandTo(node);
        assert.strictEqual(await model.getTreeItem("Checkable").exists(3), true, "目标节点没有被正确展开");
        await Util.delay(1000);
        await model.getTree("Tree").collapseAll();
        await Util.delay(1000);
    });

    Then("折叠多级节点", async function () {
        let node = ["Top One", "Sub Four"];
        await model.getTree("Tree").collapseAll();
    });

    Then("Tree控件截屏", async function () {
        await model.getTree("Tree").takeScreenshot(root_dir + '/Tree.png')
    });

    Then("展开TreeItem控件", async function () {
        node_list = ["Top One", "Sub Four", "Top Two"]
        for (node of node_list) {
            await model.getTreeItem(node).expand();
            assert.strictEqual(await model.getTreeItem(node).expandState(), 1);
        }
    });

    Then("选中一个TreeItem控件", async function () {
        await model.getTreeItem("Top One").expand();
        assert.strictEqual(await model.getTreeItem("Top One").expandState(), 1);
        await model.getTreeItem("Sub Four").expand();
        assert.strictEqual(await model.getTreeItem("Sub Four").expandState(), 1);
        await model.getTreeItem("Sub Three1").select();
        assert.strictEqual(await model.getTreeItem("Sub Three1").focused(), true);
    });
    
    When("获取TreeItem控件特有属性", async function () {

	});

    When("获取TreeItem控件所有属性", async function () {
        await model.getTreeItem("Top One").expand();
        const control = model.getTreeItem("Sub Four");
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");

        await control.expandState();
    });

    Then("获取并返回TreeItem的节点路径", async function () {
        let treePath = await model.getTreeItem("Sub Four").treePath(true);
        assert.deepEqual(treePath, ['Top One', "Sub Four"])
        let treeNumPath = await model.getTreeItem("Sub Four").treePath(false);
        assert.deepEqual(treeNumPath, [0, 3])
        
    });


    Then("TreeItem控件截屏", async function () {
        await model.getTreeItem("Top One").takeScreenshot(root_dir + '/TreeItem.png')
    });
}

Then("翻至第{int}页", async function (arg1) {
    await model.getWindow("Window").getPane("Pane").vScroll(100);
});

/* 状态条控件 */
{
    Given("StatusBar控件操作方法", async function () {
        control = model.getGeneric("StatusBar");
        await control.click(0, 0, 1);

    });
    When("获取StatusBar控件特有属性", async function () {

	});

    When("获取StatusBar控件所有属性", async function () {
        const control = model.getGeneric("StatusBar");
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");
    });
}

/* 各类控件截图 */
{
    Then("StatusBar控件截图", async function () {
        await control.takeScreenshot(root_dir + '/StatusBar.png')
    });


    Then("应用窗口截屏", async function () {
        await model.getWindow("Window").takeScreenshot(root_dir + '/windows.png')
    });

    Then("button截图", async function () {
        await model.getButton("Default").takeScreenshot(root_dir + '/button.png')
    });

    Then("checkbox截图", async function () {
        await model.getCheckBox("Checked").takeScreenshot(root_dir + '/checkbox.png');
    });

    Then("editText控件截图", async function () {
        await model.getEdit("Edit").takeScreenshot(root_dir + '/edittext.png')
    });

    Then("RadioButton控件截图", async function () {
        await model.getRadioButton("Checked1").takeScreenshot(root_dir + '/radioButton.png')
    });

    Then("Combox控件截图", async function () {

        await model.getComboBox("ComboBox1").takeScreenshot(root_dir + '/combox.png');
    });

    Then("Slider 控件截图", async function () {

        await model.getGeneric("Slider1").takeScreenshot(root_dir + '/Slider.png');
    });

    Then("ListBox控件截图", async function () {
        await model.getList("List").takeScreenshot(root_dir + '/Listbox.png');
    });

    Then("menu控件截图", async function () {
        await model.getMenuItem("Top One1").takeScreenshot(root_dir + '/MenuItem.png');
    });

    Then("ProgressBar截图", async function () {
        await model.getGeneric("ProgressBar1").takeScreenshot(root_dir + '/ProgressBar.png');
    });
}

async function getAllCommonAttr(control){
    const commonAttr = {
        enabled: null,
        focused: null,
        enabled: null,
        focused: null,
        height: null,
        helpText: null,
        hwnd: null,
        labeledText: null,
        name: null,
        processId: null,
        text: null,
        value: null,
        width: null,
        x: null,
        y: null
    }
    commonAttr.enabled = await control.enabled();
    commonAttr.focused = await control.focused();
    commonAttr.height = await control.height();
    commonAttr.helpText = await control.helpText();
    commonAttr.hwnd = await control.hwnd();
    commonAttr.labeledText = await control.labeledText();
    commonAttr.name = await control.name();
    commonAttr.processId = await control.processId();
    commonAttr.text = await control.text();
    commonAttr.value = await control.value();
    commonAttr.width = await control.width();
    commonAttr.x = await control.x();
    commonAttr.y = await control.y();

    return commonAttr;
}
