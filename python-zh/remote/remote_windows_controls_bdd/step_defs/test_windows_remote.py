from pytest_bdd import scenarios, scenario, given, when, then, parsers
import os
import pytest
import json
from auto.sync_api import sync_auto

# 加载位于"../features"目录下的所有BDD剧本文件
scenarios("../features")
root_dir = os.path.join(os.path.dirname(__file__), '..', 'images')
pid = 0

# Hook函数
@pytest.fixture(scope="session")
def remote_worker():

    # 建立远程连接
    with sync_auto("ws://192.168.3.112:3131/ws") as auto:
        RunSettings = auto.runSettings
        WinAuto = auto.winAuto
        Util = auto.util
        Screen = auto.screen
        RunSettings.set({"slowMo": 500, "reportSteps": True})
        modelWin = WinAuto.loadModel('models/model1.tmodel')
        if not os.path.exists(root_dir):
            os.makedirs(root_dir)
        capabilities = auto.capabilities()
        print("Worker端信息", capabilities)
        # 自带样例
        app_path = os.path.join(capabilities['homePath'], 'bin', 'SimpleStyles.exe')
        pid = Util.launchProcess(app_path)
        modelWin.getWindow("Window").exists(10)
        modelWin.getWindow("Window").maximize()
        Util.delay(1000)
        # 在测试运行之前的建立远程链接并启动应用（在 yield 之前的部分）
        yield auto
        # 在测试函数运行之后执行清理工作（在 yield 之后的部分）
        Util.stopProcess(pid)


@pytest.fixture(scope="session")
def modelWin(remote_worker):
    model = remote_worker.winAuto.loadModel('models/model1.tmodel')
    return model

def set_definition_function_wrapper(fn):
    if True:
        # 需要在步骤前后执行的动作
        async def new_fn(*args, **kwargs):
            # 在步骤前执行的动作
            # ...
            fn(*args, **kwargs)
            # 在步骤后执行的动作
            # ...
            # 反注释以下代码为步骤增加1秒间隔
            # Util.delay(1000)
        return new_fn
    else:  # 不执行任何操作，单纯执行步骤本身
        return fn


# CukeTest的控件操作会自动的重试
# 因此脚本中所加的延时函数Util.delay()是为了便于观察现象
# 窗口控件

@when("激活应用窗口")
def activate_window(modelWin):
    modelWin.getWindow("Window").activate()

@when("最大化应用窗口")
def maximize_window(modelWin):
    modelWin.getWindow("Window").maximize()

@then("最小化应用窗口")
def minimize_window(remote_worker, modelWin):
    Util = remote_worker.util
    modelWin.getWindow("Window").minimize()
    Util.delay(2000)

@then("恢复应用窗口")
def restore_window(modelWin):
    modelWin.getWindow("Window").restore()

@then("关闭应用窗口")
def close_window(modelWin):
    # modelWin.getWindow("Window", {"index": 1}).close()
    pass


# 按钮控件
@when("判断是否存在")
def isexists(modelWin):
    boolValue = modelWin.getButton("Default").exists(1)
    assert boolValue == True

@when("点击Default按钮")
def click_default(modelWin):
    modelWin.getButton("Default").click(0, 0, 1)

@then("双击Normal按钮")
def dblClick_normal(modelWin):
    modelWin.getButton("Normal").dblClick()


@then(parsers.parse('获取button的name属性值应该为{name}'))
def get_button_name(name, modelWin):
    nameval = modelWin.getButton("Default")
    nameval.checkProperty("name", name, "获取button的name属性值不符合预期")

@when("获取button控件所有属性")
def get_button_allProperty(modelWin, request):
    control = modelWin.getButton("Default")
    attr = getAllCommonAttr(control)
    request.attach(json.dumps(attr))
    print(attr)


# 复选框控件

@then("勾选Normal复选框")
def check_normal(modelWin):
    modelWin.getCheckBox("Normal1").check(True)
    normal1 = modelWin.getCheckBox("Normal1")
    normal1.checkProperty("checkState", True, "Normal复选框未勾选")

@when("判断checked控件已经被选中")
def is_checked(modelWin):
    modelWin.getCheckBox("Checked").check(True)
    checked = modelWin.getCheckBox("Checked")
    checked.checkProperty("checkState", True, "checked控件未被选中")

@then("取消选中checked控件")
def uncheck(modelWin):
    modelWin.getCheckBox("Checked").check(False)
    checked = modelWin.getCheckBox("Checked")
    checked.checkProperty("checkState", False, "checked控件未取消选中")

@when("获取checked控件特有属性")
def get_checked_property(modelWin, request):
    control = modelWin.getCheckBox("Checked")
    result = {}
    result["checkState"] = control.checkState()
    request.attach(json.dumps(result))


@when("获取checked控件所有属性")
def get_checked_allProperty(modelWin, request):
    # 获取Text属性的时候会报Error 的错误。
    control = modelWin.getCheckBox("Checked")
    attr = getAllCommonAttr(control)
    request.attach(json.dumps(attr))


# 输入框控件

@when("清空文本内容")
def clear_all(modelWin):
    modelWin.getEdit("Edit").clearAll()

@then(parsers.parse('输入文本内容{val}'))
def input_content(val, modelWin):
    modelWin.getEdit("Edit").set(val)
    modelWin.getEdit("Edit1").click()
    editContent = modelWin.getEdit("Edit")
    editContent.checkProperty("value", val, f'值不为"{val}"，是否被输入法影响了？')

@then("使用presskey输入特殊键")
def use_presskey(modelWin):
    modelWin.getEdit("Edit").click(0, 0, 1)
    modelWin.getEdit("Edit").pressKeys("^a")
    modelWin.getEdit("Edit").pressKeys("{BS}")
    blankContent = modelWin.getEdit("Edit")
    blankContent.checkProperty("text", '', "输入框内容没有全部删除")

@when("获取edittext控件特有属性")
def get_edittext_property(modelWin, request):
    control = modelWin.getEdit("Edit")
    result = {}
    result["readOnly"] = control.readOnly()
    request.attach(json.dumps(result))
    print(result)

@when("获取edittext控件所有属性")
def get_edittext_allProperty(modelWin, request):
    control = modelWin.getEdit("Edit")
    attr = getAllCommonAttr(control)
    request.attach(json.dumps(attr))


# 单选框控件

@when("选中RadioButton")
def check_radio(modelWin):
    modelWin.getRadioButton("Checked1").check()
    checked1 = modelWin.getRadioButton("Checked1")
    checked1.checkProperty("checked", True, "RadioButton未选中")

@when("获取RadioButton控件特有属性")
def get_radio_property(modelWin, request):
    control = modelWin.getEdit("Checked1")
    result = {}
    request.attach(json.dumps(result))

@when("获取RadioButton控件所有属性")
def get_radio_allProperty(modelWin, request):
    control = modelWin.getRadioButton("Checked1")
    attr = getAllCommonAttr(control)
    request.attach(json.dumps(attr))
    control.checked()


# 下拉框控件

@when("下拉combox控件")
def open_combox(modelWin):
    modelWin.getComboBox("ComboBox1").open()

@when(parsers.parse('选择{choice}选项'))
def select_combobox(choice,modelWin):
    modelWin.getComboBox("ComboBox1").select(choice)
    comboBox1 = modelWin.getComboBox("ComboBox1")
    comboBox1.checkProperty("selectedName", choice)

@when("获取Combox控件特有属性")
def get_combox_property(modelWin, request):
    control = modelWin.getComboBox("ComboBox1")
    result = {}
    result["options"] = control.options()
    result["itemCount"] = control.itemCount()
    result["selectedName"] = control.selectedName()
    request.attach(json.dumps(result))

@when("获取Combox控件所有属性")
def get_combox_allProperty(modelWin, request):
    control = modelWin.getComboBox("ComboBox1")
    attr = getAllCommonAttr(control)
    request.attach(json.dumps(attr))

@then(parsers.parse("第一个item值应该为{val}"))
def get_first_item(val,modelWin):
    itemval = modelWin.getComboBox("ComboBox1").options(0)
    assert itemval == val

@then("combox可编辑控件pressKey值")
def combox_presskey(modelWin):
    modelWin.getComboBox("ComboBox").click(0, 0, 1)
    modelWin.getComboBox("ComboBox").pressKeys("Hello World!")


# 滑动条控件

@when("拖拽Slider1")
def slider(remote_worker, modelWin):
    Util = remote_worker.util
    modelWin.getGeneric("Thumb").drag(0, 0)
    modelWin.getGeneric("Thumb").drop(80, 0)
    Util.delay(2000)

@then(parsers.parse("将Slider_Vertical设置为{value:d}"))
def set_slider(value,modelWin):
    modelWin.getSlider("Slider_Vertical").setPosition(value)

@when("获取Slider控件特有属性")
def get_slider_property(modelWin, request):
    control = modelWin.getSlider("Slider1")
    result = {}
    # Slider特有属性
    result["position"] = control.position()
    result["maximum"] = control.maximum()
    result["minimum"] = control.minimum()
    request.attach(json.dumps(result))

@when("获取Slider控件所有属性")
def get_slider_allProperty(modelWin, request):
    control = modelWin.getSlider("Slider1")
    attr = getAllCommonAttr(control)
    request.attach(json.dumps(attr))


# 列表框控件

@when("滚动ListBox视图")
def scroll_listBox(modelWin):
    modelWin.getList("List").vScroll("PageDown")
    modelWin.getList("List").vScroll("PageUp")
    modelWin.getList("List").vScroll("ArrowDown")
    modelWin.getList("List").vScroll("ArrowUp")

    modelWin.getList("List").vScroll(50)
    modelWin.getList("List").wheel(5)
    modelWin.getList("List").wheel(-5)

@when(parsers.parse("选中第{index:d}个选项"))
def select_option(index,modelWin):
    item = modelWin.getList("List").scrollTo(index)
    expected = modelWin.getList("List").itemName(index)
    itemName = item.name()
    assert itemName == expected

@when("获取ListBox控件特有属性")
def get_listbox_property(modelWin, request):
    control = modelWin.getList("List")
    result = {}
    result["itemCount"] = control.itemCount()
    result["columnCount"] = control.columnCount()
    result["selectedName"] = control.selectedName()
    request.attach(json.dumps(result))

@when("获取ListBox控件所有属性")
def get_listbox_allProperty(modelWin, request):
    control = modelWin.getList("List")
    attr = getAllCommonAttr(control)
    request.attach(json.dumps(attr))

    # ListBox特有方法
    control.scrollTo(2)
    control.columnName(0)
    control.columnItemValue(2, 0)
    control.columnCount()
    control.itemCount()
    control.selectedName()


@then("使用scrollTo方法获取子元素属性")
def get_child(modelWin):
    item = modelWin.getList("List").scrollTo(0)
    item.checkProperty("name", 'First Normal Item')
    val = modelWin.getList("List").columnName(0)
    assert val == ''


# 菜单控件
@given("展开子元素相关属性")
def expand_child(remote_worker, modelWin):
    Util = remote_worker.util
    modelWin.getMenu("Menu").wheel(3)
    modelWin.getMenu("Menu").select('#0')
    Util.delay(200)
    modelWin.getMenuItem("Sub Four1").click(0, 0, 1)
    Util.delay(200)

@when("获取menu控件特有属性")
def get_menu_property():
    pass

@when("获取menu控件所有属性")
def get_menu_allProperty(modelWin, request):
    control = modelWin.getMenu("Menu")
    attr = getAllCommonAttr(control)
    request.attach(json.dumps(attr))


@when("获取menuitem控件所有属性")
def get_menuitem_allProperty(modelWin, request):
    control = modelWin.getMenuItem("Top One1")
    attr = getAllCommonAttr(control)
    request.attach(json.dumps(attr))

@when("获取menuitem控件特有属性")
def get_menuItem_property():
    pass

@then("menuitem操作方法")
def open_menuitem(remote_worker, modelWin):
    Util = remote_worker.util
    modelWin.getMenuItem("Top One1").open()
    Util.delay(2000)
    modelWin.getMenuItem("Sub Four1").open()

@then("manymenu item操作")
def open_manymenu(remote_worker, modelWin):
    Util = remote_worker.util
    modelWin.getMenuItem("Menu with Many Items").open()
    Util.delay(500)
    modelWin.getMenuItem("Menu with Many Items").takeScreenshot(root_dir + '/MenuwithManyItems.png')


# 进度条控件

@when("获取ProgressBar控件特有属性")
def get_progressBar_property():
    pass

@when("获取ProgressBar控件所有属性")
def get_progressBar_allProperty(modelWin, request):
    control = modelWin.getGeneric("ProgressBar")
    attr = getAllCommonAttr(control)
    request.attach(json.dumps(attr))


# 标签页控件

@given("Tab控件操作")
def select_tab(modelWin):
    modelWin.getTab("Tab").select(1)
    modelWin.getTab("Tab").select(2)
    modelWin.getTab("Tab").select(3)
    modelWin.getTab("Tab").tabNames(1)

@when("获取Tab控件特有属性")
def get_tab_property():
    pass

@when("获取Tab控件所有属性")
def get_tab_allProperty(modelWin, request):
    control = modelWin.getTab("Tab")
    attr = getAllCommonAttr(control)
    request.attach(json.dumps(attr))

    # Tab控件特有属性
    control.activeName()
    control.count()

@then("Tab控件截屏")
def take_screenshot(modelWin):
    modelWin.getTab("Tab").takeScreenshot(root_dir + '/tab.png')


# 组控件

@given("Group控件操作方法")
def operate_group(modelWin):
    modelWin.getGeneric("This is the Header").click(0, 0, 1)

@when("获取Group控件特有属性")
def get_group_property():
    pass

@when("获取Group控件所有属性")
def get_group_allProperty(modelWin, request):
    control = modelWin.getGeneric("This is the Header")
    attr = getAllCommonAttr(control)
    request.attach(json.dumps(attr))

@then("Group控件截图")
def takeScreenshot_group(modelWin):
    modelWin.getGeneric("This is the Header").takeScreenshot(root_dir + '/GroupHeard.png')


# DataGrid控件

@given("datagrid控件操作方法")
def operate_datagrid(modelWin):
    # modelWin.getDataGrid("DataGrid").cellValue(0, "age")
    # modelWin.getDataGrid("DataGrid").columnName(0)
    pass

@when("获取datagrid控件特有属性")
def get_datagrid_property(modelWin):
    control = modelWin.getDataGrid("DataGrid")
    control.rowCount()
    control.columnCount()

@when("获取datagrid控件所有属性")
def get_datagrid_allProperty(modelWin, request):
    control = modelWin.getDataGrid("DataGrid")
    attr = getAllCommonAttr(control)
    request.attach(json.dumps(attr))

@then("datagrid控件截屏")
def takeScreenshot_datagrid(modelWin):
    modelWin.getDataGrid("DataGrid").takeScreenshot(root_dir + '/Datagrid.png')


@then(parsers.parse("获取DataGrid中{row:d}行{col:d}列的单元格值为{expect}"))
def get_datagrid_value(row, col, expect, modelWin):
    actual = modelWin.getDataGrid("DataGrid").cellValue(row, col)
    assert actual == expect

@when(parsers.parse("先获取DataGrid的第{row:d}行，再获取该行的第{col:d}列的单元格的值，并为{expect}"))
def vertify_datagrid_value(row, col, expect, modelWin):
    tableRow = modelWin.getDataGrid("DataGrid").row(row)
    tableCell = tableRow.cell(col)
    tableCell.checkProperty("value", expect, "单元格值与预期值不符")


# 树和树节点控件

@when("获取TreeItem控件特有属性")
def get_treeItem_property():
    pass

@then("直接获取TreeItem")
def get_treeitem(remote_worker, modelWin):
    Util = remote_worker.util
    node = ["Top One", "Sub Four"]
    for n in node:
        modelWin.getTree("Tree").getTreeItem(n).expand()
        Util.delay(600)
        modelWin.getTreeItem(n).checkProperty("expandState", 1)

    for n in reversed(node):
        modelWin.getTree("Tree").getTreeItem(n).collapse()
        Util.delay(600)
        modelWin.getTreeItem(n).checkProperty("expandState", 0)


@then("展开多级节点")
def expand_node(modelWin):
    node = ["Top One", "Sub Four"]
    modelWin.getTree("Tree").expandTo(node)

@when("获取Tree控件特有属性")
def get_tree_property():
    pass

@when("获取Tree控件所有属性")
def get_tree_allProperty(modelWin, request):
    control = modelWin.getTree("Tree")
    node = ["Top One", "Sub Four"]
    attr = getAllCommonAttr(control)
    request.attach(json.dumps(attr))

    # Tree控件特有属性
    control.itemCheckedStatus(node)
    control.childCount(node)
    control.treeNodeText(node)

@then("执行Tree控件操作")
def operate_tree(remote_worker, modelWin):
    Util = remote_worker.util
    node = ["Top Two", "Checkable"]
    modelWin.getTree("Tree").expandTo(node)
    assert (modelWin.getTreeItem("Checkable").exists(3) == True, "目标节点没有被正确展开")
    Util.delay(1000)
    modelWin.getTree("Tree").collapseAll()
    Util.delay(1000)

@then("折叠多级节点")
def collapse_node(modelWin):
    node = ["Top One", "Sub Four"]
    modelWin.getTree("Tree").collapseAll()

@then("Tree控件截屏")
def takeScreenshot_tree(modelWin):
    modelWin.getTree("Tree").takeScreenshot(root_dir + '/Tree.png')

@then("展开TreeItem控件")
def expand_treeItem(modelWin):
    node_list = ["Top One", "Sub Four", "Top Two"]
    for node in node_list:
        modelWin.getTreeItem(node).expand()
        modelWin.getTreeItem(node).checkProperty("expandState", 1, "TreeItem控件未展开")


@then("选中一个TreeItem控件")
def select_treeItem(modelWin):
    modelWin.getTreeItem("Top One").expand()
    modelWin.getTreeItem("Top One").checkProperty("expandState", 1, "Top One控件未展开")
    modelWin.getTreeItem("Sub Four").expand()
    modelWin.getTreeItem("Sub Four").checkProperty("expandState", 1, "Sub Four控件未展开")
    modelWin.getTreeItem("Sub Three1").select()
    modelWin.getTreeItem("Sub Three1").checkProperty("focused", True, "Sub Three1控件未选中")

@when("获取TreeItem控件所有属性")
def get_treeItem_allProperty(modelWin, request):
    modelWin.getTreeItem("Top One").expand()
    control = modelWin.getTreeItem("Sub Four")
    attr = getAllCommonAttr(control)
    request.attach(json.dumps(attr))

    control.expandState()

@then("获取并返回TreeItem的节点路径")
def get_treeItem_path(modelWin):
    treePath = modelWin.getTreeItem("Sub Four").treePath(True)
    assert treePath == ['Top One', "Sub Four"]
    treeNumPath = modelWin.getTreeItem("Sub Four").treePath(False)
    assert treeNumPath == [0, 3]


@then("TreeItem控件截屏")
def takeScreenshot_treeItem(modelWin):
    modelWin.getTreeItem("Top One").takeScreenshot(root_dir + '/TreeItem.png')


@then("翻至第{arg1}页")
def scroll_to_pane(arg1):
    modelWin.getWindow("Window").getPane("Pane").vScroll(100)

# 状态条控件

@given("StatusBar控件操作方法")
def operate_statusBar(modelWin):
    control = modelWin.getGeneric("StatusBar")
    control.click(0, 0, 1)

@when("获取StatusBar控件特有属性")
def get_statusBar_property():
    pass

@when("获取StatusBar控件所有属性")
def get_statusBar_allProperty(modelWin, request):
    control = modelWin.getGeneric("StatusBar")
    attr = getAllCommonAttr(control)
    request.attach(json.dumps(attr))


# 各类控件截图

@then("StatusBar控件截图")
def takeScreenshot_statusBar(modelWin):
    control = modelWin.getGeneric("StatusBar")
    control.takeScreenshot(root_dir + '/StatusBar.png')


@then("应用窗口截屏")
def takeScreenshot_window(modelWin):
    modelWin.getWindow("Window").takeScreenshot(root_dir + '/windows.png')

@then("button截图")
def takeScreenshot_button(modelWin):
    modelWin.getButton("Default").takeScreenshot(root_dir + '/button.png')

@then("checkbox截图")
def takeScreenshot_checkbox(modelWin):
    modelWin.getCheckBox("Checked").takeScreenshot(root_dir + '/checkbox.png')

@then("editText控件截图")
def takeScreenshot_editText(modelWin):
    modelWin.getEdit("Edit").takeScreenshot(root_dir + '/edittext.png')

@then("RadioButton控件截图")
def takeScreenshot_radio(modelWin):
    modelWin.getRadioButton("Checked1").takeScreenshot(root_dir + '/radioButton.png')

@then("Combox控件截图")
def takeScreenshot_combox(modelWin):
    modelWin.getComboBox("ComboBox1").takeScreenshot(root_dir + '/combox.png')

@then("Slider 控件截图")
def takeScreenshot(modelWin):
    modelWin.getGeneric("Slider1").takeScreenshot(root_dir + '/Slider.png')

@then("ListBox控件截图")
def takeScreenshot_listBox(modelWin):
    modelWin.getList("List").takeScreenshot(root_dir + '/Listbox.png')

@then("menu控件截图")
def takeScreenshot_menu(modelWin):
    modelWin.getMenuItem("Top One1").takeScreenshot(root_dir + '/MenuItem.png')

@then("ProgressBar截图")
def takeScreenshot_progressBar(modelWin):
    modelWin.getGeneric("ProgressBar1").takeScreenshot(root_dir + '/ProgressBar.png')


def getAllCommonAttr(control):
    commonAttr = {
        'enabled': None,
        'focused': None,
        'height': None,
        'helpText': None,
        'hwnd': None,
        'labeledText': None,
        'name': None,
        'processId': None,
        'text': None,
        'value': None,
        'width': None,
        'x': None,
        'y': None
    }
    commonAttr['enabled'] = control.enabled()
    commonAttr['focused'] = control.focused()
    commonAttr['height'] = control.height()
    commonAttr['helpText'] = control.helpText()
    commonAttr['hwnd'] = control.hwnd()
    commonAttr['labeledText'] = control.labeledText()
    commonAttr['name'] = control.name()
    commonAttr['processId'] = control.processId()
    commonAttr['text'] = control.text()
    commonAttr['value'] = control.value()
    commonAttr['width'] = control.width()
    commonAttr['x'] = control.x()
    commonAttr['y'] = control.y()

    return commonAttr