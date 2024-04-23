from leanproAuto import WinAuto, Util
from pytest_bdd import scenarios, given, when, then, parsers

# 加载Windows应用程序的UI模型文件
model = WinAuto.loadModel('./models/model1.tmodel')

# 加载位于"../features"目录下的所有BDD剧本文件
scenarios("../features")

""" 
- @given, @when, @then: pytest-bdd装饰器，用于定义测试的前提条件（Given）、操作步骤（When）和预期结果（Then）。
- parsers.parse: 解析器，用于解析步骤中的参数。
"""

# 操作目标选项
@given(parsers.parse('单击目标项{itemName}'))
def click_target_item(itemName):
    targetItem = model.getListItem(itemName)
    targetItem.click()
    Util.delay(500)

    # 检查属性focused来判断是否选中
    targetItem.checkProperty("focused", True, f"Target item {itemName} is not selected!")


@given(parsers.parse('选中目标项{name}'))
def select_target_item(name):
    item = model.getListItem(name)
    item.select()
    Util.delay(500)
    item.checkProperty("focused", True, f"Target item {name} is not selected!")


# 滚动列表
@given('使用列表方法进行滚动')
def scroll_list():
    targetList = model.getList("List")

    # 滚动到底部
    targetList.scrollToBottom()
    Util.delay(1000)

    # 滚动到顶部
    targetList.scrollToTop()


# 搜索后选中目标
@when(parsers.parse('在搜索框中输入路径{path}'))
def enter_path(path):
    searchBox = model.getEdit("Directory:")
    searchBox.set(path)
    searchBox.checkProperty("value", path, "目标未选中")
    Util.delay(1000)


@then(parsers.parse('判断搜索结果中是否存在目标项{itemName}'))
def if_target_exists(itemName):
    targetItem = model.getList('List').findItem(itemName)
    targetItem.select()
    targetItem.checkProperty("value", itemName, f"目标项 {itemName} 不存在于搜索结果中")
    Util.delay(3000)