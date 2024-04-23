const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { CukeTest } = require('cuketest');
const { Given, When, Then, setDefaultTimeout } = require('cucumber');
const { BeforeAll, Before, After, AfterAll, setDefinitionFunctionWrapper } = require('cucumber');
const { WinAuto } = require('leanpro.win');
const { Util, Screen } = require('leanpro.common');
const { Property } = require('../support/property.js');

setDefaultTimeout(60 * 1000); //set step timeout to be 60 seconds
let model = WinAuto.loadModel(__dirname + "/model1.tmodel");

let root_dir = path.join(__dirname, '../../', 'images');
let app_path = path.join(path.dirname(process.execPath) + '\\bin\\SimpleStyles.exe');
if (!fs.existsSync(root_dir)) {
    fs.mkdirSync(root_dir)
}
let pid = 0;

/* Hook函数 */
{
    BeforeAll(async function () {
        pid = await Util.launchProcess(app_path);
        await model.getWindow("Window").maximize();
        await Util.delay(1000);
        await CukeTest.minimize();
    })

    Before(async function () {
    })

    After(async function (testCase) {
        // 在每个场景结束时截图
        let filePath = path.join(root_dir, "场景-" + testCase.pickle.name + ".png")
        Screen.takeScreenshot(filePath);
        let screenshot = Screen.takeScreenshot();
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
    Given("打开应用", async function () {
        this.pid = Util.launchProcess(app_path);
    });

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
        await model.getButton("Default").checkProperty('name', name)
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
        await model.getCheckBox("Normal1").checkProperty('checkState', true, "Normal复选框未选中")
    });

    When("判断checked控件已经被选中", async function () {
        await model.getCheckBox("Checked").check(true);
        await model.getCheckBox("Checked").checkProperty('checkState', true, "checked控件未选中")
    });

    Then("取消选中checked控件", async function () {
        await model.getCheckBox("Checked").check(false);
        await model.getCheckBox("Checked").checkProperty('checkState', false, "checked控件未取消选中")
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
        await model.getEdit("Edit").checkProperty('value', val, `值不为"${val}"，是否被输入法影响了？`)
    });

    Then("使用presskey输入特殊键", async function () {
        await model.getEdit("Edit").click(0, 0, 1);
        await model.getEdit("Edit").pressKeys("^a");
        await model.getEdit("Edit").pressKeys("{BS}");
        await model.getEdit("Edit").checkProperty('text', '', '输入框内容没有全部删除')
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
        await model.getRadioButton("Checked1").checkProperty('checked', true)
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
        await model.getComboBox("ComboBox1").checkProperty('selectedName', choice)
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
        await item.checkProperty('name', expected);
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
        await item.checkProperty('name', 'First Normal Item')
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
        await model.getDataGrid("DataGrid").cellValue(0, "Email");
        await model.getDataGrid("DataGrid").columnName(0);
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
        await tableCell.checkProperty('value', expect, "与预期值不符")
    });
}

/* 树和树节点控件 */
{

    Then("直接获取TreeItem", async function () {
        let node = ["Top One", "Sub Four"];
        for(let n of node){
            await model.getTree("Tree").getTreeItem(n).expand();
            await model.getTreeItem(n).checkProperty('expandState', 1, "未展开")
            await Util.delay(600);
        }
        for (let n of node.reverse()) {
            await model.getTree("Tree").getTreeItem(n).collapse();
            await model.getTreeItem(n).checkProperty('expandState', 0)
            await Util.delay(600);
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
            await model.getTreeItem(node).highlight(5);
            await model.getTreeItem(node).checkProperty('expandState', 1, "未展开")
        }
    });

    Then("选中一个TreeItem控件", async function () {
        await model.getTreeItem("Top One").expand();
        await model.getTreeItem("Top One").checkProperty('expandState', 1, "Top One未展开")
        await model.getTreeItem("Sub Four").expand();
        await model.getTreeItem("Sub Four").checkProperty('expandState', 1, "Sub Four未展开")
        await model.getTreeItem("Sub Three1").select();
        await model.getTreeItem("Sub Three1").checkProperty('focused', true, "Sub Three1未选中")
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

/* 描述模式操作控件 */
{

    Given("使用描述模式匹配控件", async function () {
        const result = await model.getGeneric({
            "type": "Window",
            "title": "SimpleStyles"
        }).getGeneric({
            "type": "Tree",
            "className": "TreeView"
        }).getGeneric({
            "className": "TreeViewItem",
            "name": "Top One"
        }).name();
        assert.notStrictEqual(result, null)
    });
    When("使用getGeneric代替对象容器方法", async function () {
        let actualValue = "";
        let replaceType = ""
        replaceType = "Only method"
        await model.getGeneric("Edit").set(replaceType)
        await model.getGeneric("Edit").checkProperty('value', replaceType, "不符合预期值")

        replaceType = "Just Criteria"
        let control = await model.getWindow('Window').getEdit({ "type": "Edit", "className": "TextBox" })
        // let control = await model.getGeneric({"type": "Edit", "className": "TextBox" })
        await control.set(replaceType)
        actualValue = await model.getGeneric("Edit").value();
        await model.getGeneric("Edit").checkProperty('value', replaceType)

        replaceType = "Replace with Criteria part"
        await model.getGeneric("Edit", { "type": "Edit" }).set(replaceType)
        actualValue = await model.getGeneric("Edit").value();
        await model.getGeneric("Edit").checkProperty('value', replaceType)

        replaceType = "Replace with All Criteria"
        await model.getGeneric("Edit", { "type": "Edit", "className": "TextBox" }).set(replaceType)
        actualValue = await model.getGeneric("Edit").value();
        await model.getGeneric("Edit").checkProperty('value', replaceType)
    });

    Given("使用{string}的方式调用getGeneric", async function (type) {
        const typeConditions = {
            "origin method": ["Edit"],
            "only leaf criteria": [{ "type": "Edit", "className": "TextBox" }],
            "full tree criteria": [[
                {
                    "type": "Window",
                    "className": "Window",
                    "title": "SimpleStyles"
                },
                {
                    "type": "Edit",
                    "className": "TextBox"
                }
            ]],
            "part of criteria": ["Edit", { "type": "Edit", "className": "TextBox" }],
        }
        const targetCriteria = typeConditions[type];
        if(!targetCriteria){
            throw Error(`当前模式${type}并没有对应的Criteria。`)
        }
        this.criteria = targetCriteria;
    });

    Then("传入文本{string}并验证", async function (str) {

        // await model.getGeneric(...this.criteria).set(str)
        await model.getGeneric([
            {
                "type": "Window",
                "className": "Window",
                "title": "SimpleStyles"
            },
            {
                "type": "Edit",
                "className": "TextBox"
            }
        ]).set(str)
        await model.getGeneric("Edit").checkProperty('value', str, "不符合预期值")
    });
    Then("使用findControls遍历应用内控件", async function () {
        const window = model.getWindow("Window")
        await _browseControl(window)
    });
    Given("匹配节点{string}，启用{string}字段的正则匹配，参数为{string}", async function (name, field, param) {
        const criteria = {};
        criteria[`${field}~`] = param;
        this.control = await model.getGeneric(name, criteria);
        this.controls = await model.findControls(name, criteria);
        console.log('controls length', this.controls.length)
    });
    When("验证匹配到控件应该{string}", async function (state) {
        const isExist = await this.control.exists();
        assert.equal(isExist, state === "存在"?true:false)
    });
    Then("验证应该匹配到{int}个控件", async function (counts) {
        assert.strictEqual(this.controls.length, counts)
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

async function _browseControl(root) {
    const controls = await root.findControls()
    for (let control of controls) {
        assert.notStrictEqual(await control.name(), null)
    }
}