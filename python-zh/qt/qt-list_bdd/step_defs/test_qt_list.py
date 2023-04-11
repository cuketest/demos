from pytest_bdd import scenarios, scenario, given, when, then, parsers
from leanproAuto import QtAuto, Util
import pytest
import os

model = QtAuto.loadModel("models/model1.tmodel")
scenarios("../features")


@when(parsers.parse('搜索CukeTest安装路径下的{relativePath}'))
def search_path(get_install_path, relativePath):
    dest_path = os.path.join(get_install_path, relativePath)
    model.getEdit("Edit").set(dest_path)


@then(parsers.parse('点击第{index:d}个选项'))
def click_item_by_index(index):
    listObject = model.getList("List")
    listObject.scrollTo(index)
    item = listObject.getItem(index)
    item.select()
    item.highlight()


@then(parsers.parse('点击选项{filename}'))
def click_item_by_filename(filename):
    listObject = model.getList("List")
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
    if not targetItem:
        raise Exception('object not found: ' + filename)
    index = targetItem.itemIndex()
    listObject.scrollTo(index)
    item = listObject.getItem(index)
    item.select()
    item.highlight()


@given(parsers.parse('操作对象为列表中的第{index:d}个选项'), target_fixture="targetItem")
def get_target_item_by_index(index):
    return model.getList('List').getItem(index)


@then('跳转到目标选项位置')
def scroll_to_targetItem(targetItem):
    targetItem.scrollIntoView()


@then('点击目标选项')
def click_targetItem(targetItem):
    targetItem.select()
    targetItem.highlight()