from leanproAuto import AtkAuto, Util

# 加载Atk模型文件
model = AtkAuto.loadModel("model1.tmodel")

# 等待应用启动,超时时间为10秒
model.getGeneric("Standard_Dialogs").exists(10)


def test_int_dialog():
    # 打开数值对话框
    model.getButton("Input_Dialogs").click()
    model.getButton("QInputDialog::getInt()").click()

    # 修改数值框的值为{int}"
    value = 100
    model.getWindow("QInputDialog::getInteger()").exists(1)
    # model.getEdit("qt_spinbox_lineedit").set(value) # 无法识别到SpinBox中的Edit，也识别不到SpinBox，识别为了Button
    model.getEdit("Percentage:").pressKeys(value)
    Util.delay(1000)
    model.getButton("OK").click()

    # 获取按钮下一个Label,检查其name属性是否符合预期值,否则显示指定错误信息
    labelControl = model.getButton("QInputDialog::getInt()").next("Label")
    labelControl.checkProperty("name", f'{value}%', '没有成功修改数值')
def test_combo_dialog():
        
    # 打开下拉对话框
    model.getButton("Input_Dialogs").click()
    model.getButton("QInputDialog::getItem()").click()


    # 修改下拉框的值为{string}"
    season = "Fall"
    model.getComboBox("Spring").click() 
    model.getGeneric(season).click()
    # model.getComboBox("Spring").select(season) # 未实现
    Util.delay(1000)
    model.getButton("OK1").click()
    
    # 获取按钮下一个Label,检查其name属性是否符合预期值,否则显示指定错误信息
    labelControl = model.getButton("QInputDialog::getItem()").next("Label")
    labelControl.checkProperty('name', season, '没有成功修改下拉框')

def test_text_dialog():
    # 打开文本对话框
    model.getButton("QInputDialog::getMultiLineText").click()

    # 修改文本框的内容为如下
    docString = "这是一串测试文本"
    model.getEdit("Edit1").set(docString)
    Util.delay(1000)
    model.getButton("OK2").click()

    # 获取按钮下一个Label,检查其name属性是否符合预期值,否则显示指定错误信息
    labelControl = model.getButton("QInputDialog::getMultiLineText").next("Label")
    labelControl.checkProperty('name', docString, '没有成功修改文本框内容')
