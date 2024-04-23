from leanproAuto import WinAuto, Util
from pytest_html import extras
import pytest

# 加载Windows应用程序的UI模型文件
model = WinAuto.loadModel('model1.tmodel')


# 操作目标选项
def test_action_target_options(extra):
    itemName = '.'
    # 单击目标项{string}
    targetItem = model.getListItem(itemName)
    targetItem.click()
    Util.delay(500)

    # 校验属性focused是否选中
    targetItem.checkProperty("focused", True, f"Target item {itemName} is not selected!")

    name = '..'
    # 选中目标项{string}
    item = model.getListItem(name)
    item.select()
    Util.delay(500)
    item.checkProperty("focused", True, f"Target item {name} is not selected!")
    attachImage(extra)


# 滚动列表
def test_scroll_list(extra):
    # 使用列表方法进行滚动
    targetList = model.getList("List")

    # 滚动到底部
    targetList.scrollToBottom()
    Util.delay(1000)

    # 滚动到顶部
    targetList.scrollToTop()
    attachImage(extra)


# 搜索后选中目标

# 这个装饰器用于参数化测试
@pytest.mark.parametrize("path, itemName", [('C:/Windows', 'notepad.exe')])
def test_search_select(path, itemName, extra):
    # 在搜索框中输入路径{string}
    searchBox = model.getEdit("Directory:")
    searchBox.set(path)

    # 检查value属性值来判断是否选中
    searchBox.checkProperty("value", path, "目标未选中")
    Util.delay(1000)

    # 判断搜索结果中是否存在目标项{string}
    targetItem = model.getList('List').findItem(itemName)
    targetItem.select()
    targetItem.checkProperty("value", itemName, f"目标项 {itemName} 不存在于搜索结果中")
    Util.delay(3000)
    attachImage(extra)

# 截屏并添加到测试报告中
def attachImage(extra):
    screenshot = model.getWindow("Window").takeScreenshot()
    extra.append(extras.image(screenshot))