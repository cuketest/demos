import json
import pytest
from pytest_bdd import scenarios, given, when, then, parsers
from leanproAuto import Keyboard, Util, AtkAuto

# 加载位于"../features"目录下的所有BDD剧本文件
scenarios("../features")

# 加载Atk应用程序的UI模型文件
model = AtkAuto.loadModel("models/model1.tmodel")


@given("最大化应用窗口")
def maxmize_window(request):

    # 如果最大化按钮存在则点击按钮，否则用快捷键最大化窗口
    if model.getButton("最大化").exists(5):
        model.getButton("最大化").click()
    else:
        Keyboard.keyDown("command")
        Keyboard.keyTap("up")
        Keyboard.keyUp("command")
    request.attach(model.getGeneric("Icon_Browser").takeScreenshot(), 'image/png')

@given("打开搜索栏")
def open_search():
    model.getButton("Button").click()
    Util.delay(1000)


@when(parsers.parse("搜索名字包含{keywords}的图标"))
def search_icon(keywords):
    model.getEdit("搜索").set(keywords)


@then("切换图标风格")
def toggle_style():
    model.getGeneric("Symbolic").click()


@then("验证搜索结果")
def vertify_result(request):

    # 控件截屏并添加到测试报告中
    sc = model.getGeneric("Pane3").takeScreenshot()
    request.attach(sc, 'image/png')

@given("获取列表中的所有内容")
def get_list(request):

    # 获取列表中的数据转为JSON字符格式添加到测试报告中
    data = model.getGeneric("List").data()
    request.attach(json.dumps(data), 'application/json')

@when(parsers.parse("选中第{index:d}项并验证选中情况"))
def select_item(index, request):
    model.getGeneric("List").select(index)
    request.attach(model.getGeneric("List").takeScreenshot(), 'image/png')