from leanproAuto import WinAuto, Util
from pytest_bdd import scenarios, given, when, then, parsers

model = WinAuto.loadModel('./models/model1.tmodel')
scenarios("../features")


# 操作目标选项
@given(parsers.parse('单击目标项{itemName}'))
def click_target_item(itemName):
    targetItem = model.getListItem(itemName)
    targetItem.click()
    Util.delay(500)
    isFocused = targetItem.focused()
    assert isFocused == True, ('Target item ' + itemName + 'is not selected!')


@given(parsers.parse('选中目标项{name}'))
def select_target_item(name):
    item = model.getListItem(name)
    item.select()
    Util.delay(500)
    focused = item.focused()
    assert focused == True, ('Target item ' + name + 'is not selected!')


# 滚动列表
@given(parsers.parse('使用列表方法进行滚动'))
def scroll_list():
    targetList = model.getList("List")
    targetList.scrollToBottom()
    Util.delay(1000)
    targetList.scrollToTop()


# 搜索后选中目标
@when(parsers.parse('在搜索框中输入路径{path}'))
def enter_path(path):
    searchBox = model.getEdit("Directory:")
    searchBox.set(path)
    assert searchBox.value() == path
    Util.delay(1000)


@then(parsers.parse('判断搜索结果中是否存在目标项{itemName}'))
def if_target_exists(itemName):
    targetItem = model.getList('List').findItem(itemName)
    targetItem.select()
    actual = targetItem.value()
    actual == itemName
    Util.delay(3000)