from leanproAuto import QtAuto, Util
from pytest_html import extras
import os

model = QtAuto.loadModel('model1.tmodel')

# 场景: 选择目标位置的列表选项
def test_qt_list_for_dest(extra):
    # 当搜索CukeTest安装路径下的"bin"
    find_under_install_path(model, "bin")

    # 那么点击第13个选项
    itemIndex = 13
    listObject = model.getList("List")
    listObject.scrollTo(itemIndex)
    item = listObject.getItem(itemIndex)
    item.select()
    item.highlight()


# 场景: 选择列表选项
def test_qt_list_option(extra):
    # 当搜索CukeTest安装路径下的"./"
    find_under_install_path(model, "")

    # 那么点击选项"version"
    listObject = model.getList("List")
    fileName = 'version'
    while True:
        targetItem = listObject.findItem(fileName)
        if targetItem:
            break
        count = listObject.itemCount()
        listObject.scrollToBottom()  # 加载延迟加载的选项
        Util.delay(1000)
        newCount = listObject.itemCount()
        if newCount == count:
            break  # 滚动到底部没有加载新的选项即到达底部
    if not targetItem:
        raise Exception('object not found: ' + fileName)
    index = targetItem.itemIndex()
    listObject.scrollTo(index)
    item = listObject.getItem(index)
    item.select()
    item.highlight()


# 场景: 操作列表选项对象
def test_qt_list_options_object(extra):
    # 假如操作对象为列表中的第11个选项
    itemIndex = 11
    targetItem = model.getList('List').getItem(itemIndex)

    # 那么跳转到目标选项位置
    targetItem.scrollIntoView()

    # 那么点击目标选项
    targetItem.select()
    targetItem.highlight()


def find_under_install_path(model, relativePath):
    install_path = "C:\\Program Files\\LeanPro\\CukeTest"
    dest_path = os.path.join(install_path, relativePath)
    model.getEdit("Edit").set(dest_path)
