from pytest_bdd import scenarios, given, when, then, parsers
from leanproAuto import WinAuto, Util, Keyboard, Mouse
from json import dumps
import time
import os

root_dir = os.path.join(os.path.dirname(__file__), '../', 'images')
model = WinAuto.loadModel("models/model1.tmodel")
if not os.path.exists(root_dir):
    os.makedirs(root_dir)
scenarios("../features")


### 窗口控件
@when('激活应用窗口')
def activate_window():
    model.getWindow("Window").activate()


@when('最小化应用窗口')
def minimize_window():
    model.getWindow("Window").minimize()


@when('恢复应用窗口')
def restore_window():
    model.getWindow("Window").restore()


@when('最大化应用窗口')
def maximize_window():
    model.getWindow("Window").maximize()


@then('应用窗口截屏')
def takeScreenshot(request):
    screenshot = model.getWindow("Window").takeScreenshot()
    request.attach(screenshot, 'image/png')


###  Button对象控件常规操作
@when('判断是否存在')
def is_exists():
    bool = model.getButton("Default").exists(1)
    assert bool


@when('点击Default按钮')
def click_default():
    model.getButton("Default").click(0, 0, 1)


@when('双击Normal按钮')
def dblClick_normal():
    model.getButton("Normal").dblClick()


@when(parsers.parse('获取button的name属性值应该为{name}'))
def get_btnName(name):
    nameval = model.getButton("Default")
    nameval.checkProperty("name", name, "name值不符合预期")


@when('获取button控件所有属性')
def get_button_allProperty(request):
    control = model.getButton("Default")
    attr = getAllCommonAttr(control)
    print("直接print序列化后的对象信息：%s" % dumps(attr))
    request.attach("序列化后的对象信息: %s" % dumps(attr))
    request.attach(attr)


@then('button截图')
def button_screenshot(request):
    image = model.getButton("Normal").takeScreenshot()
    request.attach(image, 'image/png')


### checkbox控件对象常规操作
@when('勾选Normal复选框')
def check_normal():
    model.getCheckBox("Normal1").check(True)
    checked = model.getCheckBox("Normal1")
    checked.checkProperty("checked", True, "复选框未勾选")


@when('判断checked控件已经被选中')
def si_checked():
    model.getCheckBox("Checked").check(True)
    checkBox = model.getCheckBox("Checked")
    checkBox.checkProperty("checked", True, "checked控件未选中")


@when('取消选中checked控件')
def unchecked_checked():
    model.getCheckBox("Checked").check(False)
    checkState = model.getCheckBox("Checked")
    checkState.checkProperty("checked", False, "checked控件未取消选中")

@when('获取checked控件特有属性')
def get_checked_property(request):
    control = model.getCheckBox("Checked")
    result = {}
    result["checkState"] = control.checkState()
    request.attach(result)

@when('获取checked控件所有属性并上传报告')
def get_checked_allProperty(request):
    control = model.getCheckBox("Checked")
    attachInfo(request, control)

@then('checkbox截图')
def checkbox_screenshot():
    model.getCheckBox("Checked").takeScreenshot(root_dir + '/checkbox.png')

###  Edit对象控件常规操作
@when('清空文本内容')
def clearAll():
    model.getEdit("Edit").clearAll()


@when(parsers.parse('输入文本内容{val}'))
def input_val(val):
    model.getEdit("Edit").set(val)
    model.getEdit("Edit1").click()
    editContent = model.getEdit("Edit")
    editContent.checkProperty("value", val, "值不为" + val + "，是否被输入法影响了？")


@when('使用presskey输入特殊键')
def use_presskey():
    model.getEdit("Edit").click(0, 0, 1)
    model.getEdit("Edit").pressKeys("^a")
    model.getEdit("Edit").pressKeys("{BS}")
    blankContent = model.getEdit("Edit")
    blankContent.checkProperty("text", '', "输入框内容没有全部删除")

@when('获取Edit控件特有属性')
def get_edit_property(request):
    control = model.getEdit("Edit")
    result = {}
    result["readOnly"] = control.readOnly()
    request.attach(result)

@when('获取Edit控件所有属性并上传报告')
def get_edit_allProperty(request):
    control = model.getEdit("Edit")
    attachInfo(request, control)

@then('Edit控件截图')
def edit_screenshot():
    model.getEdit("Edit").takeScreenshot(root_dir + '/edittext.png')

### RadioButton常规操作
@when('选中RadioButton')
def check_radio():
    model.getRadioButton("Checked1").check()
    checkBox = model.getRadioButton("Checked1")
    checkBox.checkProperty("checked", True, "单选框未选中")


@when('获取RadioButton控件所有属性')
def get_radio_allProperty(request):
    control = model.getRadioButton("Checked1")
    attr = {"checked": control.checked()}
    attachInfo(request, control, attr)

@when('获取RadioButton控件特有属性')
def get_radio_property(request):
    pass

@then('RadioButton控件截图')
def radioButton_screenshot():
    model.getRadioButton("Checked1").takeScreenshot(root_dir + '/radioButton.png')

### Combox控件对象常规操作
@when('下拉combox控件')
def combox():
    model.getComboBox("ComboBox1").open()


@when(parsers.parse('选择{choice}选项'))
def select_choice(choice):
    Util.delay(500)
    model.getComboBox("ComboBox1").select(choice)
    comboBox1 = model.getComboBox("ComboBox1")
    comboBox1.checkProperty("selectedName", choice)


@when(parsers.parse('第一个item值应该为{string}'))
def item_value():
    all_options = model.getComboBox("ComboBox1").options()
    val = "First Normal Item"
    index = 0
    itemval = model.getComboBox("ComboBox1").options(index)
    assert itemval == all_options[index]


@when('combox可编辑控件pressKey值')
def combox_presskey_value():
    model.getComboBox("ComboBox").click(0, 0, 1)
    Keyboard.disableIme()
    model.getComboBox("ComboBox").pressKeys("Hello World!")


@when('获取Combox控件所有属性并上传报告')
def get_combox_allProperty(request):
    control = model.getComboBox("ComboBox1")
    result = {"options": control.options(), "itemCount": control.itemCount()}
    attachInfo(request, control, result)

@when('获取Combox控件特有属性')
def get_combox_property(request):
    control = model.getComboBox("ComboBox1")
    result = {}
    result["options"] = control.options()
    result["itemCount"] = control.itemCount()
    result["selectedName"] = control.selectedName()
    request.attach(result)

@then('Combox控件截图')
def combox_screenshot():
    model.getComboBox("ComboBox1").takeScreenshot(root_dir + '/combox.png')


### Slider控件常规操作
@when('拖拽Slider')
def drag_draop_slider():
    model.getGeneric("Thumb").drag(0, 0)
    model.getGeneric("Thumb").drop(30, 0)
    Util.delay(2000)


@when(parsers.parse('将Slider设置为{value:d}'))
def set_slider(value):
    model.getSlider("Slider1").setPosition(value)


@when('获取Slider控件特有属性', target_fixture="result")
def get_slider_property():
    control = model.getSlider("Slider1")
    result = {
        "position": control.position(),
        "maximum": control.maximum(),
        "minimum": control.minimum()
    }
    assert result["maximum"] == 10
    assert result["minimum"] == 0
    return result


@when('获取Slider控件所有属性')
def get_slider_allProperty(request, result):
    control = model.getSlider("Slider1")
    attachInfo(request, control, result)

@then('Slider控件截图')
def slider_screenshot():
    model.getGeneric("Slider1").takeScreenshot(root_dir + '/Slider.png')


### Listbox常规操作
@when('滚动ListBox视图')
def scroll_view():
    model.getList("List").vScroll("PageDown")
    model.getList("List").vScroll("PageUp")
    model.getList("List").vScroll("ArrowDown")
    model.getList("List").vScroll("ArrowUp")

    model.getList("List1").vScroll(50)
    model.getList("List1").wheel(5)
    model.getList("List1").wheel(-5)


@when(parsers.parse('选中第{index:d}个选项'))
def select(index):
    item = model.getList("List").scrollTo(index)
    selectedItem = model.getList("List").select(index)
    # assert item.index() == selectedItem.index() # 不应比较对象

    expected = model.getList("List").itemName(index)
    item.checkProperty("name", expected, "name属性与预期不符")


@when('获取列表项属性')
def get_list_property():
    name = model.getList("List").select(0)
    name.checkProperty("name", 'First Normal Item', "name属性与预期不符")
    val = model.getList("List").columnName(0)
    assert val == ''


@when('获取ListBox控件特有属性', target_fixture="result")
def get_list_property():
    control = model.getList("List")
    result = {
        "data": control.data(),
        "columnName": control.columnName(0),
        "itemCount": control.itemCount(),
        "selectedName": control.selectedName()
    }
    assert result["selectedName"] != None
    return result


@when('获取ListBox控件所有属性')
def get_list_allProperty(request, result):
    control = model.getList("List")
    attachInfo(request, control, result)

@then('ListBox控件截图')
def listBox_screenshot():
    model.getList("List").takeScreenshot(root_dir + '/Listbox.png')

### Tree相关API操作
@when('直接获取TreeItem')
def get_treeItem():
    node = ["Top One", "Sub Four"]
    for n in node:
        model.getTree("Tree").getTreeItem(n).expand()
        model.getTreeItem(n).checkProperty('expandState', 1, "未展开")
        time.sleep(0.6)

    for n in reversed(node):
        model.getTree("Tree").getTreeItem(n).collapse()
        model.getTreeItem(n).checkProperty('expandState', 0)
        time.sleep(0.6)

@then('展开多级节点')
def expand_multiNodes():
    node = ["Top One", "Sub Four"]
    model.getTree("Tree").expandTo(node)


@when('执行Tree控件操作')
def tree_operation():
    node = ["Top Two", "Checkable"];
    model.getTree("Tree").expandTo(node);
    assert model.getTreeItem("Checkable").exists(3) == True, "目标节点没有被正确展开"
    Util.delay(1000);
    model.getTree("Tree").collapseAll();
    Util.delay(1000);

@when('获取Tree控件特有属性')
def get_tree_property():
    node = ["Top One", "Sub Four"]
    control = model.getTree("Tree")
    control.itemCheckedStatus(node)
    control.childCount(node)
    control.treeNodeText(node)

@when('获取Tree控件所有属性')
def get_tree_allProperty(request):
    control = model.getTree("Tree")
    attr = getAllCommonAttr(control)
    request.attach(attr)


@when('折叠多级节点')
def collapse_multiNodes():
    node = ["Top One", "Sub Four"];
    model.getTree("Tree").collapseAll()


@then('Tree控件截屏')
def tree_screenshot():
    model.getTree("Tree").takeScreenshot(root_dir + '/Tree.png')


@when('展开treeview控件的子控件')
def expand_treeview():
    model.getTree("Tree").expandTo("Top One")


@when('关闭treeview控件的子控件')
def close_treeview():
    model.getTree("Tree").collapseAll()


@when('获取treeview节点数量')
def count_treeview():
    node = ["Top One", "Sub Four"]
    model.getTree("Tree").childCount(node)


@when('获取treeview节点文本')
def get_treeview_text():
    text = model.getTree("Tree").treeNodeText("Top One")
    assert text == "Top One"


@when('treeview控件的状态相关方法')
def treeview_status():
    bool = model.getTree("Tree").itemCheckedStatus("Top One")
    model.getTree("Tree").expandTo([0, 3])
    model.getTree("Tree").collapseAll("Top One")


@when('treeview控件所有属性')
def treeview_allProperty(request):
    control = model.getTree("Tree")
    attachInfo(request, control)


### TreeItem相关操作
@when('展开TreeItem控件')
def expand_treeItem():
    node_list = ["Top One", "Sub Four", "Top Two"]
    for node in node_list:
        model.getTreeItem(node).expand()


@when('选中一个TreeItem控件')
def select_treeItem():
    model.getTreeItem("Top One").expand()
    model.getTreeItem("Top One").checkProperty("expandState", 1, "控件未展开")
    model.getTreeItem("Sub Four").expand()
    model.getTreeItem("Sub Four").checkProperty("expandState", 1, "控件未展开")
    model.getTreeItem("Sub Three1").select()
    model.getTreeItem("Sub Three1").checkProperty("focused", True, "控件未选中")


@when('获取并返回TreeItem的节点路径')
def get_treeItem_path():
    model.getTreeItem("Sub Four").treePath()


@when('获取TreeItem控件所有属性')
def get_treeItem_allProperty(request):
    control = model.getTreeItem("Sub Four")
    result = {"expandState": control.expandState()}
    attachInfo(request, control, result)


@when('获取TreeItem控件特有属性')
def get_treeItem_property():
    pass

@then('TreeItem控件截屏')
def treeItem_screenshot():
    model.getTreeItem("Top One").takeScreenshot(root_dir + '/TreeItem.png')


### contextmenu相关操作
@given('展开子元素相关属性')
def expand_child():
    model.getMenu("Menu").wheel(3)
    model.getMenu("Menu").select('#0')
    Util.delay(200)
    model.getMenuItem("Sub Four1").click(0, 0, 1)
    Util.delay(200)


@when('获取menu控件所有属性')
def get_menu_allProperty():
    control = model.getMenu("Menu")
    attr = getAllCommonAttr(control)
    print(attr)


@when('获取menu控件特有属性')
def get_menu_property():
    pass

@when('menuitem操作方法')
def menuitem_fun():
    model.getMenuItem("Top One1").open()
    Util.delay(2000)
    model.getMenuItem("Sub Four1").open()
    # model.getMenuItem("Menu with Many Items").press("Item 1") # 不排除存在问题的可能性


@when('获取menuitem控件特有属性')
def get_menuitem_property():
    pass


@when('获取menuitem控件所有属性')
def get_menuitem_allProperty(request):
    control = model.getMenuItem("Top One1")
    attachInfo(request, control)

@when('manymenu item操作')
def manymenuItem_operation():
    model.getMenuItem("Menu with Many Items").open()
    Util.delay(500)
    model.getMenuItem("Menu with Many Items").takeScreenshot(root_dir + '/MenuwithManyItems.png')

@then('menu控件截图')
def menu_screenshot():
    model.getMenuItem("Top One1").takeScreenshot(root_dir + '/MenuItem.png')

### ProgressBar控件操作
@when('ProgressBar相关方法调用')
def progressBar_fun():
    model.getGeneric("ProgressBar").click(0, 0, 1)
    model.getGeneric("ProgressBar").dblClick(0, 0, 1)
    model.getGeneric("ProgressBar").drag(0, 0)
    model.getGeneric("ProgressBar").drop(0, 0)
    model.getGeneric("ProgressBar").exists(0)
    model.getGeneric("ProgressBar").property('name')


@when('获取ProgressBar控件所有属性')
def get_progressBar_allProperty(request):
    control = model.getGeneric("ProgressBar")
    attachInfo(request, control)


@when('获取ProgressBar控件特有属性')
def get_progressBar_property(request):
    pass


@then('ProgressBar截图')
def progressBar_screenshot():
    model.getGeneric("ProgressBar1").takeScreenshot(root_dir + '/ProgressBar.png')


### Tab控件操作
@given('Tab控件操作')
def tab_operation():
    model.getTab("Tab").select(1)
    model.getTab("Tab").select(2)
    model.getTab("Tab").select(3)
    index = 1
    all_tabnames = model.getTab("Tab").tabNames()
    tabname = model.getTab("Tab").tabNames(index)
    assert all_tabnames[index] == tabname


@when('获取Tab控件所有属性')
def get_tab_allProperty():
    pass


@when('获取Tab控件特有属性')
def get_tab_property(request):
    control = model.getTab("Tab")
    result = {
        "activeName": control.activeName(),
        "count": control.count(),
    }
    attachInfo(request, control, result)

@then('Tab控件截屏')
def tab_screenshot():
    model.getTab("Tab").takeScreenshot(root_dir + '/tab.png')

### Group控件操作
@given('Group控件操作方法')
def group_operation():
    model.getGeneric("This is the Header").click(0, 0, 1)


@when('获取Group控件特有属性')
def get_group_property():
    pass


@when('获取Group控件所有属性')
def get_group_allProperty():
    control = model.getGeneric("This is the Header")
    attr = getAllCommonAttr(control)
    print(attr)


@then('Group控件截图')
def group_screenshot():
    model.getGeneric("This is the Header").takeScreenshot(root_dir + '/GroupHeard.png')

### DataGrid控件
@when('datagrid控件操作方法')
def datagrid_operation():
    model.getDataGrid("DataGrid").cellValue(0, "Email")
    model.getDataGrid("DataGrid").columnName(0)


@when('获取datagrid控件特有属性', target_fixture="result")
def get_datagrid_property():
    control = model.getDataGrid("DataGrid")
    result = {
        "rowCount": control.rowCount(),
        "columnHeaders": control.columnHeaders(),
        "columnCount": control.columnCount()
    }
    assert result["columnHeaders"].__len__() > 0
    assert result["columnHeaders"].__len__() == result["columnCount"]
    return result


@when('获取datagrid控件所有属性')
def get_datagrid_allProperty(request, result):
    control = model.getDataGrid("DataGrid")
    attachInfo(request, control, result)


@then('datagrid控件截屏')
def datagrid_screenshot():
    model.getDataGrid("DataGrid").takeScreenshot(root_dir + '/Datagrid.png')

### DataGrid单元格索引
@when('逐行读取表格中的10行数据')
def get_datagrid_data():
    for i in range(10):
        rowdata = model.getDataGrid("DataGrid").rowData(i)
        assert rowdata != None


@then(parsers.parse("获取DataGrid中{row:d}行{col:d}列的单元格值为{expect}"))
def get_datagrid_value(row, col, expect):
    actual = model.getDataGrid("DataGrid").cellValue(row, col)
    assert actual == expect


@when(parsers.parse('先获取DataGrid的第{row:d}行，再获取该行的第{col:d}列的单元格的值，并为{expect}'))
def get_cell(row, col, expect):
    actual = model.getDataGrid("DataGrid").cellValue(row, col)
    assert actual == expect


### 状态条控件
@when('StatusBar控件操作方法')
def statusBar_operation():
    control = model.getGeneric("StatusBar")
    control.click(0, 0, 1)


@when('获取StatusBar控件所有属性')
def get_statusBar_allProperty(request):
    control = model.getGeneric("StatusBar")
    attachInfo(request, control)


@when('获取StatusBar控件特有属性')
def get_statusBar_property(request):
    pass


@then('StatusBar控件截图')
def statusBar_screenshot():
    model.getGeneric("StatusBar").takeScreenshot(root_dir + '/StatusBar.png')

### 通用控件
@given(parsers.parse('控件对象为{name}时'), target_fixture="edit")
def control_name(name):
    control = model.getGeneric(name)
    return {"control": control, "name": name}


@when('验证对象的moveMouse方法')
def vertify_moveMouse(edit, request):
    control = edit["control"]
    name = edit["name"]
    TOLERANCE = 1
    rect = control.rect()

    beforePosition = {"x": 960, "y": 540}
    Util.delay(2000)
    control.moveMouse()
    afterPosition = Mouse.position()
    targetPosition = control.rect()
    print("afterPosition %s" % afterPosition)
    print("targetPosition %s" % targetPosition)
    # diffx = afterPosition.x - targetPosition.x
    # diffy = afterPosition.y - targetPosition.y
    # if (diffx > TOLERANCE):
    #     raise Exception("水平移动坐标不正确，应为"+targetPosition["x"]+"，实际为"+afterPosition["x"]+".")
    # if (diffy > TOLERANCE):
    #     raise Exception("垂直移动坐标不正确，应为"+targetPosition["y"]+"，实际为"+afterPosition["y"]+".")
    attachInfo(request, model.getGeneric(name))

### 描述模式

@given('使用getGeneric代替正常方法')
def use_getGeneric():
    result = model.getGeneric({
        "type": "Window",
        "title": "SimpleStyles"
    }).getGeneric({
        "type": "Tree",
        "className": "TreeView"
    }).getGeneric({
        "className": "TreeViewItem",
        "name": "Top One"
    }).name()
    assert result != None

    model.getGeneric("Edit").set("Just replace")
    model.getGeneric("Edit", {
        "type": "Edit"
    }).set("Replace with Creteria part")
    model.getGeneric("Edit", {
        "type": "Edit",
        "className": "TextBox"
    }).set("Replace with All Creteria")


@when('使用findControls遍历应用')
def use_findControls():
    window = model.getWindow("Window")
    browseControl(window)


### 描述模式及正则匹配模式
@given('使用描述模式匹配控件')
def use_description():
    result = model.getGeneric({
        "type": "Window",
        "title": "SimpleStyles"
    }).getGeneric({
        "type": "Tree",
        "className": "TreeView"
    }).getGeneric({
        "className": "TreeViewItem",
        "name": "Top One"
    }).name()
    assert result != None

@when('使用getGeneric代替对象容器方法')
def get_generic():
    actualValue = ""
    replaceType = ""
    replaceType = "Only method"
    model.getGeneric("Edit").set(replaceType)
    model.getGeneric("Edit").checkProperty('value', replaceType, "不符合预期值")

    replaceType = "Just Criteria"
    control = model.getWindow('Window').getEdit({ "type": "Edit", "className": "TextBox" })
    # control = model.getGeneric({"type": "Edit", "className": "TextBox" })
    control.set(replaceType)
    actualValue = model.getGeneric("Edit").value()
    model.getGeneric("Edit").checkProperty('value', replaceType)

    replaceType = "Replace with Criteria part"
    model.getGeneric("Edit", { "type": "Edit" }).set(replaceType)
    actualValue = model.getGeneric("Edit").value()
    model.getGeneric("Edit").checkProperty('value', replaceType)

    replaceType = "Replace with All Criteria"
    model.getGeneric("Edit", { "type": "Edit", "className": "TextBox" }).set(replaceType)
    actualValue = model.getGeneric("Edit").value()
    model.getGeneric("Edit").checkProperty('value', replaceType)


@then('使用findControls遍历应用内控件')
def find_controls():
    window = model.getWindow("Window")
    browseControl(window)

### 验证getGeneric获取效果
@given(parsers.parse('使用{type}的方式调用getGeneric'))
def use_type(type, request):
    typeConditions = {
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
    targetCriteria = typeConditions[type]
    if not targetCriteria:
        raise ValueError(f"当前模式{type}并没有对应的Criteria。")


@then(parsers.parse('传入文本{str}并验证'))
def vertify_text(str):
    model.getGeneric([
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
    model.getGeneric("Edit").checkProperty('value', str, "不符合预期值")


### 使用正则表达式匹配控件
@given(parsers.parse('匹配节点{name}，启用{field}字段的正则匹配，参数为{param}'),target_fixture="controlData")
def match_node_enable_regex(name, field, param):
    criteria = {}
    criteria[f"{field}~"] = param

    control = model.getGeneric(name, criteria)
    # controls = model.findControls(name, criteria)
    # print('controls length', len(controls))
    return{'control':control}



@when(parsers.parse('验证匹配到控件应该{state}'))
def vertify_match(state, controlData):
    control = controlData['control']
    isExist = control.exists()
    assert isExist == (state == "存在")



@then(parsers.parse('验证应该匹配到{counts}个控件'))
def vertify_counts(counts):
    pass
    # assert controls.length == counts


# 获取控件所有通用信息
def getAllCommonAttr(control):
    commonAttr = {
        "enabled": None,
        "focused": None,
        "enabled": None,
        "focused": None,
        "height": None,
        "helpText": None,
        "hwnd": None,
        "labeledText": None,
        "name": None,
        "processId": None,
        "text": None,
        "value": None,
        "width": None,
        "x": None,
        "y": None
    }
    commonAttr["enabled"] = control.enabled()
    commonAttr["focused"] = control.focused()
    commonAttr["height"] = control.height()
    commonAttr["helpText"] = control.helpText()
    commonAttr["hwnd"] = control.hwnd()
    commonAttr["labeledText"] = control.labeledText()
    commonAttr["name"] = control.name()
    commonAttr["processId"] = control.processId()
    commonAttr["text"] = control.text()
    commonAttr["value"] = control.value()
    commonAttr["width"] = control.width()
    commonAttr["x"] = control.x()
    commonAttr["y"] = control.y()
    return commonAttr


# 获取控件信息并上传为附件显示在报告中
def attachInfo(request, control, appendAttr=None):
    attr = getAllCommonAttr(control)
    if appendAttr:
        attr = {**appendAttr, **attr}
    image = control.takeScreenshot()
    print("直接print序列化后的对象信息：%s" % dumps(attr))
    request.attach("序列化后的对象信息: %s" % dumps(attr))
    request.attach(attr)
    request.attach(image, 'image/png')


def browseControl(control):
    controls = control.findControls()
    for control in controls:
        assert control.name() != None