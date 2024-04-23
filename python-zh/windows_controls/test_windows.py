from leanproAuto import WinAuto, Util, Mouse, Keyboard
from json import dumps
from pytest_html import extras
import os

# 设定images目录路径
root_dir = os.path.join(os.path.dirname(__file__), 'images')

# 加载Windows应用程序的UI模型文件
model = WinAuto.loadModel('model1.tmodel')

# images目录不存在则创建
if not os.path.exists(root_dir):
    os.makedirs(root_dir)


### 窗口控件
def test_window():
    # 激活应用窗口
    model.getWindow("Window").activate()
    # 最大化应用窗口
    model.getWindow("Window").maximize()
    # 最小化应用窗口
    model.getWindow("Window").minimize()
    Util.delay(2000)
    # 恢复应用窗口
    model.getWindow("Window").restore()


###  按钮控件
def test_button(extra):
    # 判断是否存在
    bool = model.getButton("Default").exists(1)
    assert bool
    # 点击Default按钮
    model.getButton("Default").click(0, 0, 1)
    # 双击Normal按钮
    model.getButton("Normal").dblClick()
    name = "Default"
    # 获取button的name属性值应该为"{name}"
    nameval = model.getButton("Default")
    nameval.checkProperty("name", name, "name值不符合预期")

    # 获取button控件所有属性并上传报告
    control = model.getButton("Default")
    attr = getAllCommonAttr(control)
    image = model.getButton("Normal").takeScreenshot()
    print("直接print序列化后的对象信息：%s" % dumps(attr))
    extra.append(extras.text("序列化后的对象信息: %s" % dumps(attr)))
    extra.append(extras.json(attr))
    extra.append(extras.image(image))


### 复选框控件
def test_checkbox(extra):
    # 勾选Normal复选框
    model.getCheckBox("Normal1").check(True)
    checked = model.getCheckBox("Normal1")
    checked.checkProperty("checked", True, "复选框未勾选")
    # 判断checked控件已经被选中
    model.getCheckBox("Checked").check(True)
    checkBox = model.getCheckBox("Checked")
    checkBox.checkProperty("checked", True, "checked控件未选中")
    # 取消选中checked控件
    model.getCheckBox("Checked").check(False)
    checkState = model.getCheckBox("Checked")
    checkState.checkProperty("checked", False, "checked控件未取消选中")
    # 获取checked控件特有属性
    control = model.getCheckBox("Checked")
    result = {}
    result["checkState"] = control.checkState()
    extra.append(extras.text(dumps(result)))
    # 获取checked控件所有属性并上传报告
    control = model.getCheckBox("Checked")
    attachInfo(extra, control)


###  输入框控件
def test_edit(extra):
    # 清空文本内容
    model.getEdit("Edit").clearAll()
    val = "Hello World!"
    # 输入文本内容{val}
    model.getEdit("Edit").set(val)
    model.getEdit("Edit1").click()
    editContent = model.getEdit("Edit")
    editContent.checkProperty("value", val, "值不为" + val + "，是否被输入法影响了？")
    # 使用presskey输入特殊键
    model.getEdit("Edit").click(0, 0, 1)
    model.getEdit("Edit").pressKeys("^a")
    model.getEdit("Edit").pressKeys("{BS}")
    blankContent = model.getEdit("Edit")
    blankContent.checkProperty("text", '', "输入框内容没有全部删除")
    # 获取edittext控件特有属性
    control = model.getEdit("Edit")
    result = {}
    result["readOnly"] = control.readOnly()
    extra.append(extras.text(dumps(result)))
    # 获取Edit控件所有属性并上传报告
    control = model.getEdit("Edit")
    attachInfo(extra, control)


### 单选框控件
def test_radio_button(extra):
    # "选中RadioButton"
    model.getRadioButton("Checked1").check()
    checkBox = model.getRadioButton("Checked1")
    checkBox.checkProperty("checked", True, "单选框未选中")
    # 获取RadioButton控件特有属性
    control = model.getRadioButton("Checked1")

    # "获取RadioButton控件所有属性"
    attr = {"checked": control.checked()}
    attachInfo(extra, control, attr)


### 下拉框控件
def test_combobox(extra):
    # "下拉combox控件"
    model.getComboBox("ComboBox1").open()

    # "选择{string}选项"
    # Util.delay(500)
    choice = "Third Normal Item"
    model.getComboBox("ComboBox1").select(choice)
    comboBox1 = model.getComboBox("ComboBox1")
    comboBox1.checkProperty("selectedName", choice)
    # 获取Combox控件特有属性
    control = model.getComboBox("ComboBox1")
    result = {}
    result["options"] = control.options()
    result["itemCount"] = control.itemCount()
    result["selectedName"] = control.selectedName()
    extra.append(extras.json(result))

    # "第一个item值应该为{string}"
    all_options = model.getComboBox("ComboBox1").options()
    val = "First Normal Item"
    index = 0
    itemval = model.getComboBox("ComboBox1").options(index)
    assert itemval == all_options[index]

    # "combox可编辑控件pressKey值"
    model.getComboBox("ComboBox").click(0, 0, 1)
    Keyboard.disableIme()
    model.getComboBox("ComboBox").pressKeys("Hello World!")

    # "获取Combox控件所有属性并上传报告"
    control = model.getComboBox("ComboBox1")
    result = {"options": control.options(), "itemCount": control.itemCount()}
    attachInfo(extra, control, result)


### 滑动条控件
def test_slider(extra):
    # "拖拽Slider"
    model.getGeneric("Thumb").drag(0, 0)
    model.getGeneric("Thumb").drop(30, 0)
    Util.delay(2000)

    # "将Slider设置为{int}"
    value = 8
    model.getSlider("Slider1").setPosition(value)
    # Slider特有属性
    control = model.getSlider("Slider1")
    result = {
        "position": control.position(),
        "maximum": control.maximum(),
        "minimum": control.minimum()
    }
    assert result["maximum"] == 10
    assert result["minimum"] == 0

    # "获取Slider控件所有属性"
    attachInfo(extra, control, result)


### 列表框控件
def test_list(extra):
    # "滚动ListBox视图"

    model.getList("List").vScroll("PageDown")
    model.getList("List").vScroll("PageUp")
    model.getList("List").vScroll("ArrowDown")
    model.getList("List").vScroll("ArrowUp")

    model.getList("List1").vScroll(50)
    model.getList("List1").wheel(5)
    model.getList("List1").wheel(-5)

    # "选中第{int}个选项"
    index = 3
    item = model.getList("List").scrollTo(index)
    selectedItem = model.getList("List").select(index)
    # assert item.index() == selectedItem.index() # 不应比较对象

    expected = model.getList("List").itemName(index)
    item.checkProperty("name", expected, "name属性与预期不符")
    # 获取ListBox控件特有属性
    control = model.getList("List")
    result = {}
    result["itemCount"] = control.itemCount()
    result["columnCount"] = control.columnCount()
    result["selectedName"] = control.selectedName()
    extra.append(extras.json(result))
    # "获取列表项属性"
    name = model.getList("List").select(0)
    name.checkProperty("name", 'First Normal Item', "name属性与预期不符")
    val = model.getList("List").columnName(0)
    assert val == ''

    control = model.getList("List")

    # "获取ListBox控件所有属性"
    attr = getAllCommonAttr(control)
    extra.append(extras.json(attr))
    attachInfo(extra, control, result)

    # 使用scrollTo方法获取子元素属性
    item = model.getList("List").scrollTo(0)
    item.checkProperty('name', 'First Normal Item')
    val = model.getList("List").columnName(0)
    assert val == ''


### 树状视图控件
def test_treeview(extra):
    # "展开treeview控件的子控件"
    model.getTree("Tree").expandTo("Top One")

    # "关闭treeview控件的子控件"

    model.getTree("Tree").collapseAll()

    # "获取treeview节点数量"
    node = ["Top One", "Sub Four"]
    model.getTree("Tree").childCount(node)

    # "获取treeview节点文本"

    text = model.getTree("Tree").treeNodeText("Top One")
    assert text == "Top One"

    # "treeview控件的状态相关方法"
    bool = model.getTree("Tree").itemCheckedStatus("Top One")
    model.getTree("Tree").expandTo([0, 3])
    model.getTree("Tree").collapseAll("Top One")

    # "treeview控件所有属性"
    control = model.getTree("Tree")
    attachInfo(extra, control)


### 菜单控件
def test_menu(extra):
    # "展开子元素相关属性"
    model.getMenu("Menu").wheel(3)
    model.getMenu("Menu").select('#0')
    Util.delay(200)
    model.getMenuItem("Sub Four1").click(0, 0, 1)
    Util.delay(200)

    # "获取menu控件所有属性"
    control = model.getMenu("Menu")
    attr = getAllCommonAttr(control)
    extra.append(extras.json(attr))

    # "menuitem操作方法"
    model.getMenuItem("Top One1").open()
    Util.delay(2000)
    model.getMenuItem("Sub Four1").open()
    # model.getMenuItem("Menu with Many Items").press("Item 1") # 不排除存在问题的可能性

    # "获取menuitem控件特有属性"

    # "获取menuitem控件所有属性"
    control = model.getMenuItem("Top One1")
    attachInfo(extra, control)
    # menuitem操作方法
    model.getMenuItem("Top One1").open()
    Util.delay(2000)
    model.getMenuItem("Sub Four1").open()
    # manymenu item操作
    model.getMenuItem("Menu with Many Items").open()
    Util.delay(500)
    model.getMenuItem("Menu with Many Items").takeScreenshot(
        root_dir + '/MenuwithManyItems.png')


### 进度条控件
def test_progress_bar(extra):
    # "ProgressBar相关方法调用"
    model.getGeneric("ProgressBar").click(0, 0, 1)
    model.getGeneric("ProgressBar").dblClick(0, 0, 1)
    model.getGeneric("ProgressBar").drag(0, 0)
    model.getGeneric("ProgressBar").drop(0, 0)
    model.getGeneric("ProgressBar").exists(0)
    model.getGeneric("ProgressBar").property('name')

    # "获取ProgressBar控件所有属性"
    control = model.getGeneric("ProgressBar")
    attachInfo(extra, control)


### 标签页控件
def test_tab(extra):
    # "Tab控件操作"
    model.getTab("Tab").select(1)
    model.getTab("Tab").select(2)
    model.getTab("Tab").select(3)
    index = 1
    all_tabnames = model.getTab("Tab").tabNames()
    tabname = model.getTab("Tab").tabNames(index)
    assert all_tabnames[index] == tabname

    # "获取Tab控件所有属性"
    control = model.getTab("Tab")

    # Tab控件特有属性
    result = {
        "activeName": control.activeName(),
        "count": control.count(),
    }
    attachInfo(extra, control, result)
    # "Tab控件截屏"
    model.getTab("Tab").takeScreenshot(root_dir + '/tab.png')


### 组控件
def test_group(extra):
    # "Group控件操作方法"

    model.getGeneric("This is the Header").click(0, 0, 1)

    # "获取Group控件特有属性"

    # "获取Group控件所有属性"
    control = model.getGeneric("This is the Header")
    attr = getAllCommonAttr(control)
    extra.append(extras.json(attr))
    # Group控件截图
    model.getGeneric("This is the Header").takeScreenshot(root_dir +
                                                          '/GroupHeard.png')


### DataGrid控件
def test_dataGrid(extra):
    # "datagrid控件操作方法"
    model.getDataGrid("DataGrid").cellValue(0, "Email")
    model.getDataGrid("DataGrid").columnName(0)
    # "获取datagrid控件特有属性"
    control = model.getDataGrid("DataGrid")
    result = {
        "rowCount": control.rowCount(),
        "columnHeaders": control.columnHeaders(),
        "columnCount": control.columnCount()
    }
    assert result["columnHeaders"].__len__() > 0
    assert result["columnHeaders"].__len__() == result["columnCount"]
    #逐行读取表格中的10行数据
    for i in range(10):
        rowdata = model.getDataGrid("DataGrid").rowData(i)
        assert rowdata != None

    # "获取DataGrid中n行m列的单元格值正确"
    data_set = [[0, 0, "Bishop"], [0, 1, "DanBeryl"], [1, 1, "VioletPhoebe"]]
    for data in data_set:
        row, col, expect = data
        actual = model.getTable("DataGrid").cellValue(row, col)
        assert actual == expect
    # 先获取DataGrid的第{int}行，再获取该行的第{int}列的单元格的值，并为{string}
    tableRow = model.getDataGrid("DataGrid").row(row)
    tableCell = tableRow.cell(col)
    tableCell.checkProperty('value', expect, "与预期值不符")
    # "获取datagrid控件所有属性"
    attachInfo(extra, control, result)
    # datagrid控件截屏
    model.getDataGrid("DataGrid").takeScreenshot(root_dir + '/Datagrid.png')


### 树和树节点控件
def test_tree(extra):
    # 直接获取TreeItem
    node = ["Top One", "Sub Four"]
    for n in node:
        model.getTree("Tree").getTreeItem(n).expand()
        model.getTreeItem(n).checkProperty('expandState', 1, "未展开")
        Util.delay(600)
    for n in reversed(node):
        model.getTree("Tree").getTreeItem(n).collapse()
        model.getTreeItem(n).checkProperty('expandState', 0)
        Util.delay(600)

    # "获取treeview控件特有属性"
    node_path = ["Top One", "Sub Four"]
    model.getTree("Tree").expandTo(node_path)
    Util.delay(1000)

    model.getTree('Tree').itemCheckedStatus(node_path)
    model.getTree('Tree').treeNodeText(node_path)
    model.getTree('Tree').childCount(node_path)

    # "控制treeeview控件的展开"
    node_path = ["Top One", "Sub Four"]
    model.getTree('Tree').select(node_path)
    model.getTree('Tree').itemCheckedStatus(node_path)
    #. (value) => print(value))

    # "展开多级节点"
    node = ["Top One", "Sub Four"]
    model.getTree("Tree").expandTo(node)

    # "执行Tree控件操作"
    node = ["Top One", "Sub Four"]
    model.getTree("Tree").select(node)
    Util.delay(1000)

    # "折叠多级节点"
    node = ["Top One", "Sub Four"]
    model.getTree("Tree").collapseAll()

    # "获取Tree控件特有属性"

    # "获取Tree控件所有属性"
    control = model.getTree("Tree")
    attachInfo(extra, control)

    # "选中一个TreeItem控件"
    model.getTreeItem("Top One").expand()
    model.getTreeItem("Top One").checkProperty("expandState", 1, "控件未展开")
    model.getTreeItem("Sub Four").expand()
    model.getTreeItem("Sub Four").checkProperty("expandState", 1, "控件未展开")
    model.getTreeItem("Sub Three1").select()
    model.getTreeItem("Sub Three1").checkProperty("focused", True, "控件未选中")

    # "展开TreeItem控件"
    node_list = ["Top One", "Sub Four", "Top Two"]
    for node in node_list:
        model.getTreeItem(node).expand()

    # "选中一个TreeItem控件"
    model.getTreeItem("Top One").expand()
    model.getTreeItem("Sub One").select()
    model.getTreeItem("Sub Four").expand()
    model.getTreeItem("Sub Three1").select()

    # "获取并返回TreeItem的节点路径"
    model.getTreeItem("Sub Four").treePath()

    # "折叠TreeItem控件"
    node_list = ["Top One", "Top Two"]
    for node in node_list:
        model.getTreeItem(node).collapse()

    # "获取TreeItem控件所有属性"
    control = model.getTreeItem("Sub Four")
    result = {"expandState": control.expandState()}
    attachInfo(extra, control, result)
    # TreeItem控件截屏
    model.getTreeItem("Top One").takeScreenshot(root_dir + '/TreeItem.png')


### 状态条控件
def test_status_bar(extra):
    # "StatusBar控件操作方法"
    control = model.getGeneric("StatusBar")
    control.click(0, 0, 1)

    # "获取StatusBar控件所有属性"
    control = model.getGeneric("StatusBar")
    attachInfo(extra, control)


### 通用控件
def test_generic(extra):
    model.getWindow("Window").maximize()
    # "控件对象为{string}时"
    name = "Edit"
    control = model.getGeneric(name)

    # "验证对象的moveMouse方法"
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
    attachInfo(extra, model.getGeneric(name))


### "描述模式"
def test_descriptive(extra):
    # "使用描述模式匹配控件"
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
    # "使用getGeneric代替对象容器方法"
    actualValue = ""
    replaceType = ""
    replaceType = "Only method"
    model.getGeneric("Edit").set(replaceType)
    model.getGeneric("Edit").checkProperty('value', replaceType, "不符合预期值")

    replaceType = "Just Criteria"
    control = model.getWindow('Window').getEdit({
        "type": "Edit",
        "className": "TextBox"
    })

    control.set(replaceType)
    actualValue = model.getGeneric("Edit").value()
    model.getGeneric("Edit").checkProperty('value', replaceType)

    replaceType = "Replace with Criteria part"
    model.getGeneric("Edit", {"type": "Edit"}).set(replaceType)
    actualValue = model.getGeneric("Edit").value()
    model.getGeneric("Edit").checkProperty('value', replaceType)

    replaceType = "Replace with All Criteria"
    model.getGeneric("Edit", {
        "type": "Edit",
        "className": "TextBox"
    }).set(replaceType)
    actualValue = model.getGeneric("Edit").value()
    model.getGeneric("Edit").checkProperty('value', replaceType)
    # "使用{string}的方式调用getGeneric"
    data = {
        'number': [1, 2, 3, 4],
        'type': [
            'origin method', 'only leaf criteria', 'full tree criteria',
            'part of criteria'
        ],
        'str': ['', '', '', '']
    }
    for type in data['type']:
        typeConditions = {
            "origin method": ["Edit"],
            "only leaf criteria": [{
                "type": "Edit",
                "className": "TextBox"
            }],
            "full tree criteria": [[{
                "type": "Window",
                "className": "Window",
                "title": "SimpleStyles"
            }, {
                "type": "Edit",
                "className": "TextBox"
            }]],
            "part of criteria":
            ["Edit", {
                "type": "Edit",
                "className": "TextBox"
            }],
        }
        targetCriteria = typeConditions.get(type)
        if not targetCriteria:
            raise Exception(f"当前模式{type}并没有对应的Criteria。")
    # 传入文本{string}并验证
    for str in data['type']:
        model.getGeneric([{
            "type": "Window",
            "className": "Window",
            "title": "SimpleStyles"
        }, {
            "type": "Edit",
            "className": "TextBox"
        }]).set(str)
        model.getGeneric("Edit").checkProperty('value', str, "不符合预期值")
    # "使用getGeneric代替正常方法"
    model.getGeneric("Edit").set("Just replace")
    model.getGeneric("Edit", {
        "type": "Edit"
    }).set("Replace with Creteria part")
    model.getGeneric("Edit", {
        "type": "Edit",
        "className": "TextBox"
    }).set("Replace with All Creteria")

    # 使用findControls遍历应用
    window = model.getWindow("Window")
    browseControl(window)


### 使用正则表达式匹配控件
def test_regular(extra):
    data = [{
        "node": "Edit",
        "field": "className",
        "param": "Box",
        "state": "存在",
        "counts": 6
    }, {
        "node": "Edit",
        "field": "className",
        "param": "Box$",
        "state": "存在",
        "counts": 6
    }, {
        "node": "Edit",
        "field": "className",
        "param": "Text",
        "state": "存在",
        "counts": 5
    }, {
        "node": "Edit",
        "field": "className",
        "param": "^Text",
        "state": "存在",
        "counts": 5
    }, {
        "node": "Edit",
        "field": "className",
        "param": "Pass",
        "state": "存在",
        "counts": 1
    }, {
        "node": "Edit",
        "field": "className",
        "param": "^Pass",
        "state": "存在",
        "counts": 1
    }]

    # "匹配节点{string}，启用{string}字段的正则匹配，参数为{string}"
    for item in data:
        name = item['node']
        field = item['field']
        param = item['param']
        state = item['state']
        counts = item['counts']

        criteria = {}
        criteria[f"{field}~"] = param
        control = model.getGeneric(name, criteria)
        # controls = model.findControls(name, criteria)
        # print('controls length', len(controls))
        # "验证匹配到控件应该{string}"
        isExist = control.exists()
        assert isExist == (state == "存在")
        # "验证应该匹配到{int}个控件"
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
def attachInfo(extra, control, appendAttr=None):
    attr = getAllCommonAttr(control)
    if appendAttr:
        attr = {**appendAttr, **attr}
    image = control.takeScreenshot()
    print("直接print序列化后的对象信息：%s" % dumps(attr))
    extra.append(extras.text("序列化后的对象信息: %s" % dumps(attr)))
    extra.append(extras.json(attr))
    extra.append(extras.image(image))


def browseControl(control):
    controls = control.findControls()
    for control in controls:
        assert control.name() != None