from leanproAuto import QtAuto, Util
from pytest_bdd import scenarios, scenario, given, when, then, parsers
import pytest

# 加载Qt应用程序的UI模型文件
model = QtAuto.loadModel('models/model1.tmodel')

# 加载位于"../features"目录下的所有BDD剧本文件
scenarios("../features")

""" 
- @given, @when, @then: pytest-bdd装饰器，用于定义测试的前提条件（Given）、操作步骤（When）和预期结果（Then）。
- parsers.parse: 解析器，用于解析步骤中的参数。
"""

# 验证整型数值对话框
@given('打开数值对话框')
def open_numeric_dialog():
    model.getButton("输入型对话框").click()
    model.getButton("QInputDialog::getInt()").click()


@when(parsers.parse('修改数值框的值为{value:d}'))
def set_numeric_value(value):

    # 等待数值对话框打开
    model.getWindow("QInputDialog::getInteger()").exists(1)
    model.getEdit("qt_spinbox_lineedit").set(value)
    Util.delay(1000)
    model.getButton("OK").click()

    # 获取按钮的下一个 Label 控件的值来检查是否修改成功
    labelControl = model.getButton("QInputDialog::getInt()").next("Label")
    labelControl.checkProperty("text", f'{value}%', '没有成功修改数值')


# 验证下拉框选择对话框
@given('打开下拉对话框')
def open_select_dialog():
    model.getButton("输入型对话框").click()
    model.getButton("QInputDialog::getItem()").click()


@when(parsers.parse('修改下拉框的值为"{season}"'))
def set_select_dialog(season):
    model.getComboBox("ComboBox").select(season)
    Util.delay(1000)
    model.getButton("OK").click()

    # 获取按钮的下一个 Label 控件的值来检查是否修改成功
    labelControl = model.getButton("QInputDialog::getItem()").next("Label")
    labelControl.checkProperty('text', season, '没有成功修改下拉框')


# 验证多行文本输入对话框
@given('打开文本对话框')
def open_text_dialog():
    model.getButton("输入型对话框").click()
    model.getButton("QInputDialog::getMultiLineTex").click()


@when(parsers.parse('修改文本框的内容为如下{docString}'))
def set_text_dialog_content(docString):
    model.getEdit("Edit").set(docString)
    Util.delay(1000)
    model.getButton("OK").click()

    # 获取按钮的下一个 Label 控件的值来检查是否修改成功
    labelControl = model.getButton("QInputDialog::getMultiLineTex").next("Label")
    labelControl.checkProperty('text', docString, '没有成功修改文本框内容')
