from pytest_bdd import scenarios, scenario, given, when, then, parsers
from leanproAuto import QtAuto, Util
import pytest
import os

# 加载Qt应用程序的UI模型文件
model = QtAuto.loadModel("models/model1.tmodel")

# 加载位于"../features"目录下的所有BDD剧本文件
scenarios("../features")

""" 
- @given, @when, @then: pytest-bdd装饰器，用于定义测试的前提条件（Given）、操作步骤（When）和预期结果（Then）。
- parsers.parse: 解析器，用于解析步骤中的参数。
"""

@when(parsers.parse('搜索CukeTest目录下的{relativePath}'))
def search_path(get_install_path, relativePath):
    dest_path = os.path.join(get_install_path, relativePath)
    model.getEdit("Edit").set(dest_path)


@then(parsers.parse('点击第{index:d}个选项'))
def click_item_by_index(index):
    listObject = model.getList("List")
    listObject.scrollTo(index)
    item = listObject.getItem(index)
    item.select()


@then(parsers.parse('点击选项{filename}'))
def click_item_by_filename(filename):
    listObject = model.getList("List")

    # 循环直到找到目标项或无法再加载更多选项
    while True:
        targetItem = listObject.findItem(filename)
        if targetItem:
            break
        count = listObject.itemCount()
        listObject.scrollToBottom()  # 加载延迟加载的选项
        Util.delay(1000)
        newCount = listObject.itemCount()
        if newCount == count:
            break  # 滚动到底部没有加载新的选项即到达底部

    # 如果没有找到目标项，则抛出异常
    if not targetItem:
        raise Exception('object not found: ' + filename)
    index = targetItem.itemIndex()
    listObject.scrollTo(index)
    item = listObject.getItem(index)
    item.select()


@given(parsers.parse('操作对象为列表中的第{index:d}个选项'), target_fixture="targetItem")
def get_target_item_by_index(index):
    return model.getList('List').getItem(index)


@then('跳转到目标选项位置')
def scroll_to_targetItem(targetItem):
    targetItem.scrollIntoView()


@then('点击目标选项')
def click_targetItem(targetItem):
    targetItem.select()