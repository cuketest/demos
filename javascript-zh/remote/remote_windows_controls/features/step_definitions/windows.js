const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { CukeTest } = require('cuketest');
const { Given, When, Then, setDefaultTimeout } = require('cucumber');
const { BeforeAll, Before, After, AfterAll, setDefinitionFunctionWrapper } = require('cucumber');

// 设置默认超时时间为60秒
setDefaultTimeout(60 * 1000);

// 获取images目录的路径
let root_dir = path.join(__dirname, '../../', 'images');
let app_path;

// 如果images目录不存在，则创建该目录
if (!fs.existsSync(root_dir)) {
    fs.mkdirSync(root_dir);
}
let proc = {};

let auto, RunSettings, WinAuto, Util, Screen, model;
/* Hook函数 */
{

    // 在所有测试场景执行之前准备测试环境，启动被测应用并等待其出现。
    BeforeAll(async function () {

        // 获取运行配置信息，可在运行配置中指定ip地址
        const info = await CukeTest.info();
        const ip = info.profile && info.profile.custom // 如果没有指定IP则使用主机运行
            ? info.profile.custom
            : "localhost";
        auto = await CukeTest.connect({
            wsEndpoint: `ws://${ip}:3131/ws`
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

        proc = await Util.launchProcess(app_path);

        // 最大化窗口
        await model.getWindow("Window").maximize();
        await Util.delay(1000);
        // await CukeTest.minimize();
    })

    // 在每个测试场景之前执行
    Before(async function () {
    })

    // 在每个测试场景执行之后捕获当前窗口的屏幕截图并附加到测试报告。
    After(async function (testCase) {
        // 在每个场景结束时截图
        let filePath = path.join(root_dir, "场景-" + testCase.pickle.name + ".png");
        let screenshot = await Screen.takeScreenshot(filePath);
        this.attach(screenshot, 'image/png');
    });

    // 在所有测试场景执行结束后，关闭被测应用并恢复CukeTest窗口。
    AfterAll(async function () {
        await Util.stopProcess(proc.pid);
        await CukeTest.restore();
    })
}
setDefinitionFunctionWrapper(function (fn) {
    if (true) {
        // 需要在步骤前后执行的动作
        return async function () {
            // 在步骤前执行的动作
            // ...
            await fn.apply(this, arguments);
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

    // {string} 占位符接收一个字符串类型参数，字符串传递给变量name
    Then("获取button的name属性值应该为{string}", async function (name) {

        // 检查name属性是否符合预期的值，不符合时将显示指定的消息。
        let nameval = await model.getButton("Default");
        await nameval.checkProperty("name", name, "获取button的name属性值不符合预期");
    });

    When("获取button控件所有属性", async function () {
        const stepThis = this;
        const control = model.getButton("Default");

        // 获取button控件所有属性并转化为JSON字符串添加到报告中
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");
    });
}

/* 复选框控件 */
{
    Then("勾选Normal复选框", async function () {
        await model.getCheckBox("Normal1").check(true);

        // 检查Normal复选框是否选中，没选中则显示指定信息
        let normal1 = await model.getCheckBox("Normal1");
        await normal1.checkProperty("checkState", true, "Normal复选框未勾选");
    });

    When("判断checked控件已经被选中", async function () {
        await model.getCheckBox("Checked").check(true);

        // 检查Checked复选框是否选中，没选中则显示指定信息
        let checked = await model.getCheckBox("Checked");
        checked.checkProperty("checkState", true, "checked控件未被选中");
    });

    Then("取消选中checked控件", async function () {
        await model.getCheckBox("Checked").check(false);

        // 检查Checked复选框是否取消选中，否则显示指定信息
        let checked = await model.getCheckBox("Checked");
        checked.checkProperty("checkState", false, "checked控件未取消选中");
    });

    When("获取checked控件特有属性", async function () {
        const control = model.getCheckBox("Checked");
        let result = {};

        // 获取复选框的选中状态，将结果对象转换为格式化的 JSON 字符串，并附加到测试报告中
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

    // {string} 占位符接收一个字符串类型参数，字符串传递给变量val
    Then("输入文本内容{string}", async function (val) {
        await model.getEdit("Edit").set(val);
        await model.getEdit("Edit1").click();

        // 检查value属性值是否为预期值，否则显示指定信息
        let editContent = await model.getEdit("Edit");
        await editContent.checkProperty("value", val, `值不为"${val}"，是否被输入法影响了？`);
    });

    Then("使用presskey输入特殊键", async function () {
        await model.getEdit("Edit").click(0, 0, 1);

        // 按下 Ctrl + A 键，选中所有文本
        await model.getEdit("Edit").pressKeys("^a");

        // 按下 Backspace 键，删除所有选中的文本
        await model.getEdit("Edit").pressKeys("{BS}");

        // 验证编辑框的文本内容是否为空，若不为空则输出错误信息
        let blankContent = await model.getEdit("Edit");
        await blankContent.checkProperty("text", '', "输入框内容没有全部删除");
    });

    When("获取edittext控件特有属性", async function () {
        const control = model.getEdit("Edit");
        let result = {};

        // 获取edittext控件的只读属性，将结果对象转换为格式化的 JSON 字符串，并附加到测试报告中
        result["readOnly"] = await control.readOnly();
        this.attach(JSON.stringify(result,null,'\t'), "application/json");
	});

    When("获取edittext控件所有属性", async function () {
        const control = model.getEdit("Edit");

        // 获取edittext控件的所有属性，将结果对象转换为格式化的 JSON 字符串，并附加到测试报告中
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");
    });
}

/* 单选框控件 */
{
    When("选中RadioButton", async function () {
        await model.getRadioButton("Checked1").check(true);
        let checked1 = await model.getRadioButton("Checked1");

        // 验证单选按钮的选中状态是否为 true，若不为 true 则输出错误信息
        await checked1.checkProperty("checked", true, "RadioButton未选中");
    });

    When("获取RadioButton控件特有属性", async function () {
        const control = model.getEdit("Checked1");
        let result = {};
        this.attach(JSON.stringify(result,null,'\t'), "application/json");
	});

    When("获取RadioButton控件所有属性", async function () {
        const control = model.getRadioButton("Checked1");

        // 获取RadioButton控件的所有属性，将结果对象转换为格式化的 JSON 字符串，并附加到测试报告中
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

    // {string} 占位符接收一个字符串类型参数，字符串传递给变量choice
    When("选择{string}选项", async function (choice) {
        // await Util.delay(500);
        await model.getComboBox("ComboBox1").select(choice);

        // 验证选中的选项是否与给定的选择相匹配，若不匹配则输出错误信息
        let comboBox1 = await model.getComboBox("ComboBox1");
        await comboBox1.checkProperty("selectedName", choice);
    });

    When("获取Combox控件特有属性", async function () {
        const control = model.getComboBox("ComboBox1");

        // 获取下拉框的选项列表，选项数量，选项名称
        let result = {};
        result["options"] = await control.options();
        result["itemCount"] = await control.itemCount();
        result["selectedName"] = await control.selectedName();

        // 将结果对象转换为格式化的 JSON 字符串，并附加到测试报告中
        this.attach(JSON.stringify(result,null,'\t'), "application/json");
	});

    When("获取Combox控件所有属性", async function () {
        const control = model.getComboBox("ComboBox1");

        // 获取Combox控件所有属性，并将结果转换为JSON字符串，添加到测试报告中
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");
    });

    // {string} 占位符接收一个字符串类型参数，字符串传递给变量val
    Then("第一个item值应该为{string}", async function (val) {

        // 验证第一个选项的值是否与给定的值相等，若不相等则抛出断言错误
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
        // 拖拽控件到指定坐标位置
        await model.getGeneric("Thumb").drag(0, 0);
        await model.getGeneric("Thumb").drop(80, 0);
        await Util.delay(2000);
    });

    // {int} 占位符接收一个整数类型参数，字符串传递给变量value
    Then("将Slider_Vertical设置为{int}", async function (value) {
        await model.getSlider("Slider_Vertical").setPosition(value);
    });

    When("获取Slider控件特有属性", async function () {
        const control = model.getSlider("Slider1");

        // 获取Slider控件的位置属性，最大值和最小值属性，转为JSON字符串添加到测试报告中
        let result = {};
        // Slider特有属性
        result["position"] = await control.position();
        result["maximum"] = await control.maximum();
        result["minimum"] = await control.minimum();
        this.attach(JSON.stringify(result,null,'\t'), "application/json");
	});

    When("获取Slider控件所有属性", async function () {
        const control = model.getSlider("Slider1");

        // 获取Slider控件的所有属性，转为JSON字符串添加到测试报告中
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");

    });
}

/* 列表框控件 */
{
    When("滚动ListBox视图", async function () {

        // 垂直方向的页面向下和 向上滚动, 箭头键向下和向上滚动
        await model.getList("List").vScroll("PageDown");
        await model.getList("List").vScroll("PageUp");
        await model.getList("List").vScroll("ArrowDown");
        await model.getList("List").vScroll("ArrowUp");

        // 垂直方向的滚动，滚动距离为 50 个像素
        await model.getList("List").vScroll(50);

        // 鼠标滚轮向上滚动 5 次和向下滚动 5 次
        await model.getList("List").wheel(5);
        await model.getList("List").wheel(-5);
    });

    // {int} 占位符接收一个整数类型参数，字符串传递给变量index
    When("选中第{int}个选项", async function (index) {
        let item = await model.getList("List").scrollTo(index);

        // 验证实际项名称是否与预期项名称相等，若不相等则抛出断言错误
        let expected = await model.getList("List").itemName(index);
        let itemName = await item.name();

        // 断言itemName === expected
        assert.strictEqual(itemName, expected);
    });

    When("获取ListBox控件特有属性", async function () {
        const control = model.getList("List");
        let result = {};

        // 获取ListBox控件的控件个数属性,列表列数属性和被选中的控件名属性,并转换为JSON字符串添加到测试报告中
        result["itemCount"] = await control.itemCount();
        result["columnCount"] = await control.columnCount();
        result["selectedName"] = await control.selectedName();
        this.attach(JSON.stringify(result, null, '\t'), "application/json");
	});

    When("获取ListBox控件所有属性", async function () {
        const control = model.getList("List");
        let attr = await getAllCommonAttr(control);

        // 将attr转为json字符串添加到测试报告中，方便查看
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
        await item.checkProperty("name", 'First Normal Item');
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

        // 获取menu控件所有属性并转为JSON字符串添加到测试报告中
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");
    });

    When("获取menuitem控件特有属性", async function () {

	});

    When("获取menuitem控件所有属性", async function () {
        const control = model.getMenuItem("Top One1");

        // 获取menuitem控件所有属性并转为JSON字符串添加到测试报告中
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");
    });

    Then("menuitem操作方法", async function () {
        await model.getMenuItem("Top One1").open();

        // 延迟2秒，等待操作完成
        await Util.delay(2000);
        await model.getMenuItem("Sub Four1").open();
    });

    Then("manymenu item操作", async function () {
        await model.getMenuItem("Menu with Many Items").open();

        // 延迟0.5秒，等待操作完成
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

        // 将attr转为json字符串并添加到测试报告中，方便查看
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

        // 展示click三个参数(x, y, mouseKey)，坐标相对于控件(0,0)，1为点击鼠标左键
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
        await model.getGeneric("This is the Header").takeScreenshot(root_dir + '/GroupHeard.png');
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

        // 将attr值转成json字符串并添加到测试报告中，方便查看
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");
    });

    Then("datagrid控件截屏", async function () {

        await model.getDataGrid("DataGrid").takeScreenshot(root_dir + '/Datagrid.png');
    });

    Then("获取DataGrid中{int}行{int}列的单元格值为{string}", async function (row, col, expect) {
        let actual = await model.getDataGrid("DataGrid").cellValue(row, col);

        // 断言actual === expect
        assert.strictEqual(actual, expect);
    });
    
    When("先获取DataGrid的第{int}行，再获取该行的第{int}列的单元格的值，并为{string}", async function (row, col, expect) {
        let tableRow = await model.getDataGrid("DataGrid").row(row);
        let tableCell = await tableRow.cell(col);
        await tableCell.checkProperty("value", expect, "单元格值与预期值不符");
    });
}

/* 树和树节点控件 */
{

    Then("直接获取TreeItem", async function () {
        let node = ["Top One", "Sub Four"];
        for(let n of node){
            await model.getTree("Tree").getTreeItem(n).expand();
            await Util.delay(600);
            await model.getTreeItem(n).checkProperty("expandState", 1);
            
        }
        for (let n of node.reverse()) {
            await model.getTree("Tree").getTreeItem(n).collapse();
            await Util.delay(600);
            await model.getTreeItem(n).checkProperty("expandState", 0);
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

        // 将attr值转成json字符串并添加到测试报告中，方便查看
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");

        // Tree控件特有属性
        await control.itemCheckedStatus(node);
        await control.childCount(node);
        await control.treeNodeText(node);

    });

    Then("执行Tree控件操作", async function () {
        let node = ["Top Two", "Checkable"];
        await model.getTree("Tree").expandTo(node);

        // 断言控件是否存在
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
        await model.getTree("Tree").takeScreenshot(root_dir + '/Tree.png');
    });

    Then("展开TreeItem控件", async function () {
        node_list = ["Top One", "Sub Four", "Top Two"];
        for (node of node_list) {
            await model.getTreeItem(node).expand();
            await model.getTreeItem(node).checkProperty("expandState", 1, "TreeItem控件未展开");
        }
    });

    Then("选中一个TreeItem控件", async function () {
        await model.getTreeItem("Top One").expand();
        await model.getTreeItem("Top One").checkProperty("expandState", 1, "Top One控件未展开");
        await model.getTreeItem("Sub Four").expand();
        await model.getTreeItem("Sub Four").checkProperty("expandState", 1, "Sub Four控件未展开");
        await model.getTreeItem("Sub Three1").select();
        await model.getTreeItem("Sub Three1").checkProperty("focused", true, "Sub Three1控件未选中");
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
        assert.deepEqual(treePath, ['Top One', "Sub Four"]);
        let treeNumPath = await model.getTreeItem("Sub Four").treePath(false);
        assert.deepEqual(treeNumPath, [0, 3]);
        
    });


    Then("TreeItem控件截屏", async function () {
        await model.getTreeItem("Top One").takeScreenshot(root_dir + '/TreeItem.png');
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
        await control.takeScreenshot(root_dir + '/StatusBar.png');
    });


    Then("应用窗口截屏", async function () {
        await model.getWindow("Window").takeScreenshot(root_dir + '/windows.png');
    });

    Then("button截图", async function () {
        await model.getButton("Default").takeScreenshot(root_dir + '/button.png');
    });

    Then("checkbox截图", async function () {
        await model.getCheckBox("Checked").takeScreenshot(root_dir + '/checkbox.png');
    });

    Then("editText控件截图", async function () {
        await model.getEdit("Edit").takeScreenshot(root_dir + '/edittext.png');
    });

    Then("RadioButton控件截图", async function () {
        await model.getRadioButton("Checked1").takeScreenshot(root_dir + '/radioButton.png');
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
