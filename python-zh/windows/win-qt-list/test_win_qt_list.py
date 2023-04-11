from leanproAuto import WinAuto, Util
from pytest_html import extras

model = WinAuto.loadModel('model1.tmodel')


# 操作目标选项
def test_action_target_options(extra):
    itemName = '.'
    # 单击目标项{string}
    targetItem = model.getListItem(itemName)
    targetItem.click()
    Util.delay(500)
    isFocused = targetItem.focused()
    assert isFocused == True, ('Target item ' + itemName + 'is not selected!')

    name = '..'
    # 选中目标项{string}
    item = model.getListItem(name)
    item.select()
    Util.delay(500)
    focused = item.focused()
    assert focused == True, ('Target item ' + name + 'is not selected!')


# 滚动列表
def test_scroll_list():
    # 使用列表方法进行滚动
    targetList = model.getList("List")
    targetList.scrollToBottom()
    Util.delay(1000)
    targetList.scrollToTop()


# 搜索后选中目标
def test_search_select():
    path = 'C:/Windows'
    # 在搜索框中输入路径{string}
    searchBox = model.getEdit("Directory:")
    searchBox.set(path)
    assert searchBox.value() == path
    Util.delay(1000)

    itemName = 'notepad.exe'
    # 判断搜索结果中是否存在目标项{string}
    targetItem = model.getList('List').findItem(itemName)
    targetItem.select()
    actual = targetItem.value()
    actual == itemName
    Util.delay(3000)