from leanproAuto import QtAuto, Util
from pytest_html import extras
import os

model = QtAuto.loadModel('model1.tmodel')

# 场景: 选择目标位置的列表选项
def test_qt_list_for_dest(get_install_path, extra):
    # 当搜索CukeTest安装路径下的"./"
    dest_path = os.path.join(get_install_path, "")
    model.getEdit("Edit").set(dest_path)

    # 那么点击第13个选项
    itemIndex = 13
    listObject = model.getList("List")
    listObject.scrollTo(itemIndex)
    item = listObject.getItem(itemIndex)
    item.select()
    attachImage(extra)


# 场景: 选择列表选项
def test_qt_list_option(get_install_path, extra):
    # 当搜索CukeTest安装路径下的"./"
    dest_path = os.path.join(get_install_path, "plugins")
    model.getEdit("Edit").set(dest_path)

    # 那么点击选项"version"
    listObject = model.getList("List")
    fileName = 'platforms'
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
    attachImage(extra)


# 场景: 操作列表选项对象
def test_qt_list_options_object(extra):
    # 假如操作对象为列表中的第3个选项
    itemIndex = 3
    targetItem = model.getList('List').getItem(itemIndex)

    # 那么跳转到目标选项位置
    targetItem.scrollIntoView()

    # 那么点击目标选项
    targetItem.select()
    attachImage(extra)


# 截屏并添加到测试报告
def attachImage(extra):
    screenshot = model.getWindow("Fetch_More_Example").takeScreenshot()
    extra.append(extras.image(screenshot))