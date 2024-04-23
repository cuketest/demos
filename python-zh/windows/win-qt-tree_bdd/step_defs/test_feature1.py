from leanproAuto import WinAuto, Util
from pytest_bdd import scenarios, given, when, then, parsers
import os
import json

# 加载Windows应用程序的UI模型文件
model = WinAuto.loadModel('./models/model1.tmodel')

# 加载位于"../features"目录下的所有BDD剧本文件
scenarios("../features")

""" 
- @given, @when, @then: pytest-bdd装饰器，用于定义测试的前提条件（Given）、操作步骤（When）和预期结果（Then）。
- parsers.parse: 解析器，用于解析步骤中的参数。
"""

# 操作树节点对象（需要识别模型）
@given(parsers.parse('点击模型中的树节点{treeItemName}'))
def click_tree_node(treeItemName):
    model.getTreeItem(treeItemName).click(0, 0, 1)


@given(parsers.parse('展开和折叠模型中的树节点{treeItemName}'))
def expand_tree_node(treeItemName):
    model.getTreeItem(treeItemName).expand()
    Util.delay(2000)
    model.getTreeItem(treeItemName).collapse()


# 操作树对象（不需要识别模型）
@given(parsers.parse('点击树中的{pathString}'))
def click_tree_objects(pathString):
    # 解析 JSON 字符串，将其转换为相应的 Python 对象
    treepath = json.loads(pathString)
    treepath[0] = getDiskName(treepath[0],model)  # 处理磁盘符名称
    model.getTree("Tree").select(treepath)


@given(parsers.parse('折叠与展开树中的{pathString}'))
def collapse_tree_objects(pathString):
    treepath = json.loads(pathString)
    model.getTree("Tree").showHeader(3)
    model.getTree("Tree").childCount(treepath)


# 访问目标路径
# target_fixture用于传递item变量到上下文
@given(parsers.parse("访问并选中{relativePath}文件"), target_fixture="item")
def access_target_path(relativePath):

    # 将相对路径转换为绝对路径，并按照路径分隔符进行拆分
    treepath = os.path.abspath(relativePath).split('\\')
    tree = model.getTree('Tree')
    
    treepath[0] = getDiskName(treepath[0], model)
    print(treepath)
    item = tree.select(treepath)
    return item


@then(parsers.parse('{expectedItemName}节点选中'))
def node_selected(expectedItemName, item):
    itemName = item.name()

    # 检查name和focused属性值是否符合预期值，否则输出指定信息
    item.checkProperty("name", expectedItemName, f"预期节点名称为 {expectedItemName}，实际节点名称为 {itemName}")
    item.checkProperty("focused", True, "节点未被选中")


def getDiskName(deskSign, model):
    # 通过磁盘符（如"C:"）获取完整磁盘名称
    [diskItem, _] = model.getTree("Tree").findControls({
        "type": "TreeItem",
        "name~": deskSign
    })
    print(diskItem.name())
    return diskItem.name()