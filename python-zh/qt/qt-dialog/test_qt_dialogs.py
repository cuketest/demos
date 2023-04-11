from leanproAuto import QtAuto, Util
from pytest_html import extras

model = QtAuto.loadModel('model1.tmodel')


# 验证整型数值对话框
def test_qt_int_dialog(extra):
    model.getButton("输入型对话框").click()
    model.getButton("QInputDialog::getInt()").click()

    value = 10
    # 修改数值框的值为{int}
    model.getWindow("QInputDialog::getInteger()").exists(1)
    model.getEdit("qt_spinbox_lineedit").set(value)
    Util.delay(1000)
    model.getButton("OK").click()
    labelControl = model.getButton("QInputDialog::getInt()").next("Label")
    inputValue = int(labelControl.text().replace("%", ""))
    extra.append(extras.image(model.getWindow("Standard_Dialogs").takeScreenshot()))
    assert inputValue == value, "没有成功修改数值"


# 验证下拉框选择对话框
def test_qt_select_dialog(extra):
    model.getButton("输入型对话框").click()
    model.getButton("QInputDialog::getItem()").click()

    season = "Fall"
    # 修改下拉框的值为{string}
    model.getComboBox("ComboBox").select(season)
    Util.delay(1000)
    model.getButton("OK").click()
    labelControl = model.getButton("QInputDialog::getItem()").next("Label")
    selectedValue = labelControl.text()
    extra.append(extras.image(model.getWindow("Standard_Dialogs").takeScreenshot()))
    assert selectedValue == season, "没有成功修改下拉框"


# 验证多行文本输入对话框
def test_qt_multiline_dialog(extra):
    model.getButton("输入型对话框").click()
    model.getButton("QInputDialog::getMultiLineTex").click()

    docString = """多行文本
        含缩进和换行
    """
    # 修改文本框的内容为如下
    model.getEdit("Edit").set(docString)
    Util.delay(1000)
    model.getButton("OK").click()
    labelControl = model.getButton("QInputDialog::getMultiLineTex").next("Label")
    textValue = labelControl.text()
    extra.append(extras.image(model.getWindow("Standard_Dialogs").takeScreenshot()))
    assert textValue == docString, "没有成功修改文本框内容"