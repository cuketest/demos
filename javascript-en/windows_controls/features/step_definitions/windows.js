const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { CukeTest } = require('cuketest');
const { Given, When, Then, setDefaultTimeout } = require('cucumber');
const { BeforeAll, Before, After, AfterAll, setDefinitionFunctionWrapper } = require('cucumber');
const { WinAuto } = require('leanpro.win');
const { Util, Screen } = require('leanpro.common');
const { Property } = require('../support/property.js');
let model = WinAuto.loadModel(__dirname + "/model1.tmodel");

setDefaultTimeout(60 * 1000); //set step timeout to be 60 seconds
let root_dir = path.join(__dirname, '../../', 'images')
let app_path = path.join(path.dirname(process.execPath) + '\\bin\\SimpleStyles.exe');
if (!fs.existsSync(root_dir)) {
    fs.mkdirSync(root_dir)
}
let pid = 0;

/* Hook */
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
        // Take screenshots at the end of each scene
        let filePath = path.join(root_dir, "Scenario-" + testCase.pickle.name + ".png")
        Screen.takeScreenshot(filePath);
        let screenshot = Screen.takeScreenshot();
        this.attach(screenshot, 'image/png');
    });

    AfterAll(async function () {
        await Util.stopProcess(pid);
        await CukeTest.restore();
        await CukeTest.maximize();
    })
}
setDefinitionFunctionWrapper(function (fn) {
    if (true) {
        return async function () {
            // Action before step running
            // ...
            await fn.apply(this, arguments)
            // Action after step running
            // ...
            // Such as: uncomment the below line to add 1 second interval for step.
            // await Util.delay(1000);
        }
    }
    else { // Just run step itself
        return fn
    }
})

/* Window Control */
{
    When("Activate app window", async function () {
        await model.getWindow("Window").activate();
    });

    When("Maximize app window", async function () {
        await model.getWindow("Window").maximize();
    });

    Then("Minimize app window", async function () {
        await model.getWindow("Window").minimize();
        await Util.delay(2000);
    });
    Then("Restore app window", async function () {
        await model.getWindow("Window").restore();
    });
}

/* Button Control */
{
    Then("Determines whether button control existed", async function () {
        let bool = await model.getButton("Default").exists(1);
        return assert.strictEqual(bool, true);
    });

    When("Click Default button", async function () {
        await model.getButton("Default").click(0, 0, 1);

    });

    Then("Double click Normal button", async function () {
        await model.getButton("Normal").dblClick();
    });


    Then("Button control's name attribute should be {string}", async function (name) {
        let nameval = await model.getButton("Default").getProperty('name');
        return assert.strictEqual(nameval, name);
    });

    When("Get button control's common attribute", async function () {
        const stepThis = this;
        const control = model.getButton("Default");
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");
    });
}

/* CheckBox Control */
{
    Then("Check Normal checkbox", async function () {
        await model.getCheckBox("Normal1").check(true);
        let checked = await model.getCheckBox("Normal1").checkState();
        assert.equal(checked, true);
    });

    When("Determines whether checkbox control has been checked", async function () {
        await model.getCheckBox("Checked").check(true);
        let checkState = await model.getCheckBox("Checked").checkState();
        return assert.equal(checkState, true)
    });

    Then("Uncheck Normal checkbox", async function () {
        await model.getCheckBox("Checked").check(false);
        let checkState = await model.getCheckBox("Checked").checkState();
        return assert.equal(checkState, false);
    });

    When("Get checked control's unique attribute", async function () {
        const control = model.getCheckBox("Checked");
        let result = {};
        result["checkState"] = await control.checkState();
        this.attach(JSON.stringify(result,null,'\t'), "application/json");
	});

    When("Get checked control's common attribute", async function () {
        const control = model.getCheckBox("Checked");
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr, null, '\t'), "application/json");
    });
}

/* Edit Control */
{
    When("Clear all text area", async function () {
        await model.getEdit("Edit").clearAll();
    });

    Then("Input text {string}", async function (val) {
        await model.getEdit("Edit").set(val);
        await model.getEdit("Edit1").click();
        let editContent = await model.getEdit("Edit").value();
        assert.strictEqual(editContent, val, `Value is not "${val}".`)
    });

    Then("Enter control-key by pressKeys method", async function () {
        await model.getEdit("Edit").click(0, 0, 1);
        await model.getEdit("Edit").pressKeys("^a");
        await model.getEdit("Edit").pressKeys("{BS}");
        let blankContent = await model.getEdit("Edit").text();
        assert.strictEqual(blankContent, '', "Edit box not empty");
    });

    When("Get edittext control's unique attribute", async function () {
        const control = model.getEdit("Edit");
        let result = {};
        result["readOnly"] = await control.readOnly();
        this.attach(JSON.stringify(result,null,'\t'), "application/json");
	});

    When("Get edittext control's common attribute", async function () {
        const control = model.getEdit("Edit");
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");
    });
}

/* RadioButton Control */
{
    When("Check RadioButton control", async function () {
        await model.getRadioButton("Checked1").check(true);
        let bool = await model.getRadioButton("Checked1").checked();
        return assert.equal(bool, true);
    });

    When("Get RadioButton control's unique attribute", async function () {
        const control = model.getEdit("Checked1");
        let result = {};
        this.attach(JSON.stringify(result,null,'\t'), "application/json");
	});

    When("Get RadioButton control's common attribute", async function () {
        const control = model.getRadioButton("Checked1");
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");
        await control.checked();
    });
}

/* ComboBox/Dropdown Control */
{
    When("Dropdown combobox control", async function () {
        await model.getComboBox("ComboBox1").open();
    });

    When("Select {string} item", async function (choice) {
        // await Util.delay(500);
        await model.getComboBox("ComboBox1").select(choice);
        let selectedName = await model.getComboBox("ComboBox1").selectedName();

        assert.strictEqual(choice, selectedName);
    });

    When("Get Combox control's unique attribute", async function () {
        const control = model.getComboBox("ComboBox1");
        let result = {};
        result["options"] = await control.options();
        result["itemCount"] = await control.itemCount();
        result["selectedItem"] = await control.selectedItem();
        this.attach(JSON.stringify(result,null,'\t'), "application/json");
	});

    When("Get Combox control's common attribute", async function () {
        const control = model.getComboBox("ComboBox1");
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");
    });

    Then("The first item should be {string}", async function (val) {
        let itemval = await model.getComboBox("ComboBox1").getItem(0);
        return assert.strictEqual(itemval, val);
    });

    Then("Presskey on editable-combobox control", async function () {
        await model.getComboBox("ComboBox").click(0, 0, 1);
        await model.getComboBox("ComboBox").pressKeys("Hello World!");
    });
}

/* Slider Control */
{
    When("Drag&drop Slider1 control", async function () {
        await model.getGeneric("Thumb").drag(0, 0);
        await model.getGeneric("Thumb").drop(80, 0);
        await Util.delay(2000);
    });

    Then("Set Slider_Vertical control value to {int}", async function (value) {
        await model.getSlider("Slider_Vertical").setValue(value);
    });

    When("Get Slider control's unique attribute", async function () {
        const control = model.getSlider("Slider1");
        let result = {};
        // Sliderunique attributes
        result["position"] = await control.position();
        result["maximum"] = await control.maximum();
        result["minimum"] = await control.minimum();
        this.attach(JSON.stringify(result,null,'\t'), "application/json");
	});

    When("Get Slider control's common attribute", async function () {
        const control = model.getSlider("Slider1");
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");

    });
}

/* List Control */
{
    When("Scroll ListBox control's view", async function () {

        await model.getList("List").vScroll("PageDown");
        await model.getList("List").vScroll("PageUp");
        await model.getList("List").vScroll("ArrowDown");
        await model.getList("List").vScroll("ArrowUp");

        await model.getList("List").vScroll(50);
        await model.getList("List").wheel(5);
        await model.getList("List").wheel(-5);
    });

    When("Check the {int}th. item", async function (index) {
        let item = await model.getList("List").scrollTo(index);
        let expected = await model.getList("List").itemName(index);
        let itemName = await item.name();
        assert.strictEqual(itemName, expected);
    });

    When("Get ListBox control's unique attribute", async function () {
        const control = model.getEdit("List");
        let result = {};
        result["itemCount"] = await control.itemCount();
        result["columnCount"] = await control.columnCount();
        result["selectedName"] = await control.selectedName();
        this.attach(JSON.stringify(result, null, '\t'), "application/json");
	});

    When("Get ListBox control's common attribute", async function () {
        const control = model.getList("List");
        let attr = await getAllCommonAttr(control);
                this.attach(JSON.stringify(attr, null, '\t'), "application/json");

        // ListBoxunique method
        await control.scrollTo(2);
        await control.columnName(0);
        await control.columnItemValue(2, 0);
        await control.columnCount();
        await control.itemCount();
        await control.selectedItem();
    });


    Then("Get child element attribute by using scrollTo method", async function () {
        let item = await model.getList("List").scrollTo(0);
        assert.strictEqual(await item.name(), 'First Normal Item');
        let val = await model.getList("List").columnName(0);
        assert.strictEqual(val, '');
    });
}


/* Menu Control */
{

    Given("Expand child control's associated method", async function () {
        await model.getMenu("Menu").wheel(3);
        await model.getMenu("Menu").select('#0');
        await Util.delay(200);
        await model.getMenuItem("Sub Four1").click(0, 0, 1);
        await Util.delay(200);

    });

    When("Get menu control's unique attribute", async function () {

	});

    When("Get menu control's common attribute", async function () {
        const control = model.getMenu("Menu");
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");
    });

    When("Get menuitem control's unique attribute", async function () {

	});

    When("Get menuitem control's common attribute", async function () {
        const control = model.getMenuItem("Top One1");
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");
    });

    When("MenuItem's operation methods", async function () {
        await model.getMenuItem("Top One1").open();
        await model.getMenuItem("Top One1").openMenu("Sub Four");
    });

    Then("Many MenuItems' operation methods", async function () {
        await model.getMenuItem("Menu with Many Items").open();
        await Util.delay(500);
        await model.getMenuItem("Menu with Many Items").takeScreenshot(root_dir + '/MenuwithManyItems.png');
    });
}

/* ProgressBar Control */
{

    When("Get ProgressBar control's unique attribute", async function () {

	});

    When("Get ProgressBar control's common attribute", async function () {
        const control = model.getGeneric("ProgressBar");
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");
    });
}

/* Tab Control */
{
    Given("Tab's operation methods", async function () {
        await model.getTab("Tab").select(1);
        await model.getTab("Tab").select(2);
        await model.getTab("Tab").select(3);
        await model.getTab("Tab").itemName(1)
    });

    When("Get Tab control's unique attribute", async function () {

	});

    When("Get Tab control's common attribute", async function () {
        const control = model.getTab("Tab");
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");

        // Tab Controlunique attributes
        await control.selectedItem();
        await control.itemCount()
        await control.selectedItem()

    });

    Then("Take Screenshot of Tab control", async function () {

        await model.getTab("Tab").takeScreenshot(root_dir + '/tab.png');
    });
}

/* Group Control */
{
    Given("Group's operation methods", async function () {
        await model.getGeneric("This is the Header").click(0, 0, 1);
    });

    When("Get Group control's unique attribute", async function () {

	});

    When("Get Group control's common attribute", async function () {
        const control = model.getGeneric("This is the Header");
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");
    });

    Then("Take Screenshot of Group control", async function () {
        await model.getGeneric("This is the Header").takeScreenshot(root_dir + '/GroupHeard.png')
    });
}

/* DataGrid Control */
{
    Given("datagrid's operation methods", async function () {
        // await model.getDataGrid("DataGrid").cellValue(0, "age");
        // await model.getDataGrid("DataGrid").columnName(0);
    });

    When("Get datagrid control's unique attribute", async function () {
        const control = model.getDataGrid("DataGrid");
        await control.rowCount();
        await control.columnCount();
	});

    When("Get datagrid control's common attribute", async function () {
        const control = model.getDataGrid("DataGrid");
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");
    });

    Then("Take Screenshot of datagrid control", async function () {

        await model.getDataGrid("DataGrid").takeScreenshot(root_dir + '/Datagrid.png')
    });

    Then("Determines {int} row {int} column cell value is {string} on DataGrid", async function (row, col, expect) {
        await model.getDataGrid("DataGrid").cellValue(row, col)
            .then((actual) => assert.strictEqual(actual, expect));
    });
    When("Get the {int} row, then get its {int} column cell value is {string}", async function (row, col, expect) {
        let tableRow = await model.getDataGrid("DataGrid").row(row);
        let tableCell = await tableRow.cell(col);
        await tableCell.value()
            .then((actual) => assert.strictEqual(actual, expect));
    });
}

/* Tree&TreeItem Control */
{
    Then("Get treeview control's unique attribute", async function () {
        let node_path = ["Top One", "Sub Four"];
        await model.getTree("Tree").expandTreeNode(node_path);
        await Util.delay(1000);

        await model.getTree('Tree').getItemCheckedStatus(node_path)
            .then((value) => console.log("getItemCheckedStatus:", value));
        await model.getTree('Tree').getTreeNodeText(node_path)
            .then((value) => console.log("getTreeNodeText:", value));
        await model.getTree('Tree').getTreeNodeCount(node_path)
            .then((value) => console.log("getTreeNodeCount:", value));

    });

    Then("Expand multi-level Tree node", async function () {
        let node = ["Top One", "Sub Four"];
        await model.getTree("Tree").expandTo(node);
    });

    When("Get Tree control's unique attribute", async function () {

	});

    When("Get Tree control's common attribute", async function () {
        const control = model.getTree("Tree");
        let node = ["Top One", "Sub Four"];
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");

        // Tree Controlunique attributes
        await control.getItemCheckedStatus(node);
        await control.getTreeNodeCount(node);
        await control.getTreeNodeText(node);

    });

    Then("Operate Tree control method", async function () {
        let node = ["Top One", "Sub Four"];
        await model.getTree("Tree").dblClickTreeNode(node);
        await Util.delay(1000);
        await model.getTree("Tree").selectTreeNode(node);
        await Util.delay(1000);
    });

    Then("Collapse multi-level Tree node", async function () {
        let node = ["Top One", "Sub Four"];
        await model.getTree("Tree").collapseTreeNode(node[0]);
        await model.getWindow('Window').pressKeys("%p");
    });

    Then("Take Screenshot of Tree control", async function () {
        await model.getTree("Tree").takeScreenshot(root_dir + '/Tree.png')
    });

    Then("Verify get & setItemCheckedStatus method ", async function () {
        let node = ["Top One", "Sub Four"];
        let expanded = true;
        await model.getTree("Tree").setItemCheckedStatus(node, expanded);
        let isExpand = await model.getTree("Tree").itemCheckedStatus(node);
        assert.strictEqual(isExpand, expanded, "Target node was not expand correctly");
    });

    Then("Get TreeItem control directly", async function () {
        let node = ["Top One", "Sub Four"];
        for (let n of node) {
            await model.getTree("Tree").getTreeItem(n).expand();
            assert.strictEqual(await model.getTreeItem(n).expandState(), 1);
            await Util.delay(600);
        }
        for (let n of node.reverse()) {
            await model.getTree("Tree").getTreeItem(n).collapse();
            assert.strictEqual(await model.getTreeItem(n).expandState(), 0);
            await Util.delay(600);
        }

    });

    Then("Expand TreeItem control", async function () {
        node_list = ["Top One", "Sub Four", "Top Two"]
        for (node of node_list) {
            await model.getTreeItem(node).expand();
        }
    });

    Then("Select a TreeItem control", async function () {
        await model.getTreeItem("Top One").expand();
        await model.getTreeItem("Sub Four").expand();
        await model.getTreeItem("Sub Three1").setSelect(true);
    });
    
    When("Get TreeItem control's unique attribute", async function () {

	});

    When("Get TreeItem control's common attribute", async function () {
        const control = model.getTreeItem("Sub Four");
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");

        await control.expandState();
    });

    Then("Get a TreeItem control's treepath attribute", async function () {
        await model.getTreeItem("Sub Four").getTreePath();
    });


    Then("Take Screenshot of TreeItem control", async function () {
        await model.getTreeItem("Top One").takeScreenshot(root_dir + '/TreeItem.png')
    });
}

Then("Turn to page {int}", async function (arg1) {
    await model.getWindow("Window").getPane("Pane").vScroll(100);
});

/* StatusBar Control */
{
    Given("StatusBar's operation methods", async function () {
        control = model.getGeneric("StatusBar");
        await control.click(0, 0, 1);

    });
    When("Get StatusBar control's unique attribute", async function () {

	});

    When("Get StatusBar control's common attribute", async function () {
        const control = model.getGeneric("StatusBar");
        let attr = await getAllCommonAttr(control);
        this.attach(JSON.stringify(attr,null,'\t'), "application/json");
    });
}

/* Screenshots of various controls */
{
    Then("Take Screenshot of StatusBar control", async function () {
        await control.takeScreenshot(root_dir + '/StatusBar.png')
    });


    Then("Take Screenshot of app window", async function () {
        await model.getWindow("Window").takeScreenshot(root_dir + '/windows.png')
    });

    Then("Take Screenshot of button control", async function () {
        await model.getButton("Default").takeScreenshot(root_dir + '/button.png')
    });

    Then("Take Screenshot of checkbox control", async function () {
        await model.getCheckBox("Checked").takeScreenshot(root_dir + '/checkbox.png');
    });

    Then("Take Screenshot of editText control", async function () {
        await model.getEdit("Edit").takeScreenshot(root_dir + '/edittext.png')
    });

    Then("Take Screenshot of RadioButton control", async function () {
        await model.getRadioButton("Checked1").takeScreenshot(root_dir + '/radioButton.png')
    });

    Then("Take Screenshot of Combox control", async function () {

        await model.getComboBox("ComboBox1").takeScreenshot(root_dir + '/combox.png');
    });

    Then("Slider Take Screenshot of  control", async function () {

        await model.getGeneric("Slider1").takeScreenshot(root_dir + '/Slider.png');
    });

    Then("Take Screenshot of ListBox control", async function () {
        await model.getList("List").takeScreenshot(root_dir + '/Listbox.png');
    });

    Then("Take Screenshot of treeview control", async function () {
        await model.getTree("Tree").takeScreenshot(root_dir + '/treeview.png');
    });

    Then("Take Screenshot of menu control", async function () {
        await model.getMenuItem("Top One1").takeScreenshot(root_dir + '/MenuItem.png');
    });

    Then("Take Screenshot of ProgressBar control", async function () {
        await model.getGeneric("ProgressBar1").takeScreenshot(root_dir + '/ProgressBar.png');
    });
}

/* 描述模式操作控件 */
{

    Given("Match controls using the description pattern", async function () {
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
    When("Use getGeneric instead of object container method", async function () {
        let actualValue = "";
        let replaceType = ""
        replaceType = "Only method"
        await model.getGeneric("Edit").set(replaceType)
        actualValue = await model.getGeneric("Edit").value();
        assert.strictEqual(actualValue, replaceType);

        replaceType = "Just Criteria"
        let control = await model.getWindow('Window').getEdit({ "type": "Edit", "className": "TextBox" })
        // let control = await model.getGeneric({"type": "Edit", "className": "TextBox" })
        console.log(control)
        await control.set(replaceType)
        actualValue = await model.getGeneric("Edit").value();
        assert.strictEqual(actualValue, replaceType);

        replaceType = "Replace with Criteria part"
        await model.getGeneric("Edit", { "type": "Edit" }).set(replaceType)
        actualValue = await model.getGeneric("Edit").value();
        assert.strictEqual(actualValue, replaceType);

        replaceType = "Replace with All Criteria"
        await model.getGeneric("Edit", { "type": "Edit", "className": "TextBox" }).set(replaceType)
        actualValue = await model.getGeneric("Edit").value();
        assert.strictEqual(actualValue, replaceType);
    });

    Given("Use {string} to call getGeneric", async function (type) {
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
        if (!targetCriteria) {
            throw Error(`The current mode ${type} does not have a corresponding Criteria.`)
        }
        this.criteria = targetCriteria;
    });

    Then("Pass in the text {string} and validate", async function (str) {

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
        let actualValue = await model.getGeneric("Edit").value();
        assert.strictEqual(actualValue, str);
    });
    Then("Traverse in-app controls with findControls", async function () {
        const window = model.getWindow("Window")
        await _browseControl(window)
    });
    Given("Match node {string}, enable regular matching of {string} field, parameter is {string}", async function (name, field, param) {
        const criteria = {};
        criteria[`${field}~`] = param;
        this.control = await model.getGeneric(name, criteria);
        this.controls = await model.findControls(name, criteria);
    });
    When("Validation matches to the control should be {string}", async function (state) {
        const isExist = await this.control.exists();
        assert.equal(isExist, state === "exist" ? true : false)
    });
    Then("Validation should match {int} controls", async function (counts) {
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