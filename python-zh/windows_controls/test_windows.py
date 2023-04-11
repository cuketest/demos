from leanproAuto import sync_auto
from json import dumps
from pytest_html import extras
### 窗口控件
def test_window():
    with sync_auto() as auto:        
        WinAuto = auto.winAuto
        Util = auto.util
        model = WinAuto.loadModel('model1.tmodel')
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
    with sync_auto() as auto:        
        WinAuto = auto.winAuto
        model = WinAuto.loadModel('model1.tmodel')
        # 判断是否存在
        bool = model.getButton("Default").exists(1)
        assert bool 
        # 点击Default按钮
        model.getButton("Default").click(0, 0, 1)
        # 双击Normal按钮
        model.getButton("Normal").dblClick()
        name = "Default"
        # 获取button的name属性值应该为"{name}"
        nameval = model.getButton("Default").property('name')
        assert nameval==name

        # 获取button控件所有属性并上传报告
        control = model.getButton("Default")
        attr = getAllCommonAttr(control)
        image = model.getButton("Normal").takeScreenshot()
        print("直接print序列化后的对象信息：%s" %dumps(attr))
        extra.append(extras.text("序列化后的对象信息: %s" %dumps(attr)))
        extra.append(extras.json(attr))
        extra.append(extras.image(image))

### 复选框控件 
def test_checkbox(extra):
    with sync_auto() as auto:        
        WinAuto = auto.winAuto
        model = WinAuto.loadModel('model1.tmodel')
        # 勾选Normal复选框
        model.getCheckBox("Normal1").check(True)
        checked = model.getCheckBox("Normal1").checkState()
        assert checked == True
        # 判断checked控件已经被选中
        model.getCheckBox("Checked").check(True)
        checkState = model.getCheckBox("Checked").checkState()
        assert checkState == True
        # 取消选中checked控件
        model.getCheckBox("Checked").check(False)
        checkState = model.getCheckBox("Checked").checkState()
        assert checkState == False

        # 获取checked控件所有属性并上传报告
        control = model.getCheckBox("Checked")
        attachInfo(extra, control)

###  输入框控件
def test_edit(extra): 
    with sync_auto() as auto:        
        WinAuto = auto.winAuto
        model = WinAuto.loadModel('model1.tmodel')
        # 清空文本内容
        model.getEdit("Edit").clearAll()
        val = "Hello World!"
        # 输入文本内容{val}
        model.getEdit("Edit").set(val)
        model.getEdit("Edit1").click()
        editContent = model.getEdit("Edit").value()
        assert editContent == val, "值不为"+val+"，是否被输入法影响了？"
        # 使用presskey输入特殊键
        model.getEdit("Edit").click(0, 0, 1)
        model.getEdit("Edit").pressKeys("^a")
        model.getEdit("Edit").pressKeys("{BS}")
        blankContent = model.getEdit("Edit").text()
        assert blankContent == '', "输入框内容没有全部删除"

        # 获取Edit控件所有属性并上传报告
        control = model.getEdit("Edit")
        attachInfo(extra, control)

### 单选框控件
def test_radio_button(extra): 
    with sync_auto() as auto:        
        WinAuto = auto.winAuto
        model = WinAuto.loadModel('model1.tmodel')
        # "选中RadioButton"
        model.getRadioButton("Checked1").check()
        bool = model.getRadioButton("Checked1").checked()
        assert bool == True
        
        control = model.getRadioButton("Checked1")
        attr = {
            "checked": control.checked()
        }
        # "获取RadioButton控件所有属性"
        attachInfo(extra, control, attr)


### 下拉框控件
def test_combobox(extra): 
    with sync_auto() as auto:        
        WinAuto = auto.winAuto
        Util = auto.util
        Keyboard = auto.keyboard
        model = WinAuto.loadModel('model1.tmodel')
        # "下拉combox控件"
        model.getComboBox("ComboBox1").open()

        # "选择{string}选项"
        Util.delay(500)
        choice = "Third Normal Item"
        model.getComboBox("ComboBox1").select(choice)
        selectedName = model.getComboBox("ComboBox1").selectedName()

        assert choice == selectedName

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
        result = {
            "options": control.options(),
            "itemCount": control.itemCount()
        }
        attachInfo(extra, control, result)

### 滑动条控件
def test_slider(extra): 
    with sync_auto() as auto:        
        WinAuto = auto.winAuto
        Util = auto.util
        model = WinAuto.loadModel('model1.tmodel')
        # "拖拽Slider"
        model.getGeneric("Thumb").drag(0, 0)
        model.getGeneric("Thumb").drop(30, 0)
        Util.delay(2000)

        # "将Slider设置为{int}"
        value = 8
        model.getSlider("Slider1").setPosition(value)

        # "获取Slider控件特有属性"
        control = model.getSlider("Slider1")
        # Slider特有属性
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
    with sync_auto() as auto:        
        WinAuto = auto.winAuto
        model = WinAuto.loadModel('model1.tmodel')
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
        itemName = item.name()
        assert itemName == expected

        # "获取列表项属性"
        name = model.getList("List").select(0)
        assert name.name() == 'First Normal Item'
        val = model.getList("List").columnName(0)
        assert val == ''

        
        control = model.getList("List")
        # "获取ListBox控件特有属性"
        result = {
            "data": control.data(),
            "columnName": control.columnName(0),
            "itemCount": control.itemCount(),
            "selectedName": control.selectedName()
        }
        assert result["selectedName"] != None

        # "获取ListBox控件所有属性"
        attachInfo(extra, control, result)

### 树状视图控件
def test_treeview(extra): 
    with sync_auto() as auto:        
        WinAuto = auto.winAuto
        model = WinAuto.loadModel('model1.tmodel')

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
    with sync_auto() as auto:        
        WinAuto = auto.winAuto
        Util = auto.util
        model = WinAuto.loadModel('model1.tmodel')

        # "展开子元素相关属性"
        model.getMenu("Menu").wheel(3)
        model.getMenu("Menu").select('#0')
        Util.delay(200)
        model.getMenuItem("Sub Four1").click(0, 0, 1)
        Util.delay(200)

        # "获取menu控件所有属性"
        control = model.getMenu("Menu")
        attr = getAllCommonAttr(control)
        print(attr)

        # "menuitem操作方法"
        model.getMenuItem("Top One1").open()
        Util.delay(2000)
        model.getMenuItem("Sub Four1").open()
        # model.getMenuItem("Menu with Many Items").press("Item 1") # 不排除存在问题的可能性

        # "获取menuitem控件特有属性"

        # "获取menuitem控件所有属性"
        control = model.getMenuItem("Top One1")
        attachInfo(extra, control)

### 进度条控件
def test_progress_bar(extra):
    with sync_auto() as auto:        
        WinAuto = auto.winAuto
        Util = auto.util
        model = WinAuto.loadModel('model1.tmodel')
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
    with sync_auto() as auto:        
        WinAuto = auto.winAuto
        model = WinAuto.loadModel('model1.tmodel')
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

### 组控件
def test_group(extra): 
    with sync_auto() as auto:        
        WinAuto = auto.winAuto
        model = WinAuto.loadModel('model1.tmodel')
        # "Group控件操作方法"

        model.getGeneric("This is the Header").click(0, 0, 1)

        # "获取Group控件特有属性"

        
        # "获取Group控件所有属性"
        control = model.getGeneric("This is the Header")
        attr = getAllCommonAttr(control)
        print(attr)

### DataGrid控件
    with sync_auto() as auto:        
        WinAuto = auto.winAuto
        model = WinAuto.loadModel('model1.tmodel')
        
        # "datagrid控件操作方法"
        model.getDataGrid("DataGrid").cellValue(0, "Email")
        model.getDataGrid("DataGrid").columnName(0)

        #逐行读取表格中的10行数据
        for i in range(10):
            rowdata = model.getDataGrid("DataGrid").rowData(i)
            assert rowdata != None

        # "获取DataGrid中n行m列的单元格值正确"
        data_set = [[0, 0, "Bishop"], [0, 1, "DanBeryl"], [1, 1, "VioletPhoebe"]]
        for data in data_set:
            row,col,expect = data
            actual = model.getTable("DataGrid").cellValue(row, col)
            assert actual == expect
        
        # "获取datagrid控件特有属性"
        control = model.getDataGrid("DataGrid")
        result = {
            "rowCount": control.rowCount(),
            "columnHeaders": control.columnHeaders(),
            "columnCount": control.columnCount()
        }
        assert result["columnHeaders"].__len__() > 0 
        assert result["columnHeaders"].__len__() == result["columnCount"]

        # "获取datagrid控件所有属性"
        attachInfo(extra, control, result)


### 树和树节点控件
def test_tree(extra): 
    with sync_auto() as auto:        
        WinAuto = auto.winAuto
        Util = auto.util
        model = WinAuto.loadModel('model1.tmodel')
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
        assert model.getTreeItem("Top One").expandState() == 1
        model.getTreeItem("Sub Four").expand()
        assert model.getTreeItem("Sub Four").expandState() == 1
        model.getTreeItem("Sub Three1").select()
        assert model.getTreeItem("Sub Three1").focused() == True

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
        result = {
            "expandState": control.expandState()
        }
        attachInfo(extra, control, result)

### 状态条控件
def test_status_bar(extra): 
    with sync_auto() as auto:        
        WinAuto = auto.winAuto
        model = WinAuto.loadModel('model1.tmodel')
        # "StatusBar控件操作方法"
        control = model.getGeneric("StatusBar")
        control.click(0, 0, 1)

        
        # "获取StatusBar控件所有属性"
        control = model.getGeneric("StatusBar")
        attachInfo(extra, control)

### 通用控件
def test_generic(extra): 
    with sync_auto() as auto:        
        WinAuto = auto.winAuto
        Mouse = auto.mouse
        model = WinAuto.loadModel('model1.tmodel')
        # "控件对象为{string}时"
        name = "Edit"
        control = model.getGeneric(name)

        # "验证对象的moveMouse方法"
        TOLERANCE = 1
        rect = control.rect()

        beforePosition = {"x": 960, "y":540}
        control.moveMouse()
        afterPosition = Mouse.position()
        targetPosition = control.rect()
        print("afterPosition %s" %afterPosition)
        print("targetPosition %s" %targetPosition)
        # diffx = afterPosition.x - targetPosition.x
        # diffy = afterPosition.y - targetPosition.y
        # if (diffx > TOLERANCE):
        #     raise Exception("水平移动坐标不正确，应为"+targetPosition["x"]+"，实际为"+afterPosition["x"]+".")
        # if (diffy > TOLERANCE):
        #     raise Exception("垂直移动坐标不正确，应为"+targetPosition["y"]+"，实际为"+afterPosition["y"]+".")
        attachInfo(extra, model.getGeneric(name))

### "描述模式"
def test_descriptive(extra): 
    with sync_auto() as auto:        
        WinAuto = auto.winAuto
        model = WinAuto.loadModel('model1.tmodel')
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

        # "使用getGeneric代替正常方法"
        model.getGeneric("Edit").set("Just replace")
        model.getGeneric("Edit", { "type": "Edit" }).set("Replace with Creteria part")
        model.getGeneric("Edit", { "type": "Edit", "className":"TextBox"}).set("Replace with All Creteria")
        
        # 使用findControls遍历应用
        window = model.getWindow("Window")
        browseControl(window)



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
    commonAttr["enabled"]= control.enabled()
    commonAttr["focused"]= control.focused()
    commonAttr["height"]= control.height()
    commonAttr["helpText"]= control.helpText()
    commonAttr["hwnd"]= control.hwnd()
    commonAttr["labeledText"]= control.labeledText()
    commonAttr["name"]= control.name()
    commonAttr["processId"]= control.processId()
    commonAttr["text"]= control.text()
    commonAttr["value"]= control.value()
    commonAttr["width"]= control.width()
    commonAttr["x"]= control.x()
    commonAttr["y"]= control.y()
    return commonAttr

# 获取控件信息并上传为附件显示在报告中
def attachInfo(extra, control, appendAttr = None):
    attr = getAllCommonAttr(control)
    if appendAttr:
        attr = {**appendAttr, **attr}
    image = control.takeScreenshot()
    print("直接print序列化后的对象信息：%s" %dumps(attr))
    extra.append(extras.text("序列化后的对象信息: %s" %dumps(attr)))
    extra.append(extras.json(attr))
    extra.append(extras.image(image))


def browseControl(control):
    controls = control.findControls()
    for control in controls:
        assert control.name() != None