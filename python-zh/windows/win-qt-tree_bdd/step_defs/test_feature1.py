from leanproAuto import WinAuto, Util
from pytest_bdd import scenarios, given, when, then, parsers
import os
import json

model = WinAuto.loadModel('./models/model1.tmodel')
scenarios("../features")


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
    treepath = json.loads(pathString)
    model.getTree("Tree").select(treepath)


@given(parsers.parse('折叠与展开树中的{pathString}'))
def collapse_tree_objects(pathString):
    treepath = json.loads(pathString)
    model.getTree("Tree").showHeader(3)
    model.getTree("Tree").childCount(treepath)


# 访问目标路径
@given(parsers.parse("访问并选中{relativePath}文件"), target_fixture="item")
def access_target_path(relativePath):
    treepath = os.path.abspath(relativePath).split('\\')
    tree = model.getTree('Tree')
    # 由于磁盘名称不同这里为路径中的磁盘名做修改
    # 通过磁盘符（如"C:"）获取完整磁盘名称
    treepath[0] = getDiskName(treepath[0], model)
    print(treepath)
    item = tree.select(treepath)
    return item


@then(parsers.parse('{expectedItemName}节点选中'))
def node_selected(expectedItemName, item):
    itemName = item.name()
    assert itemName == expectedItemName
    selected = item.focused()
    assert selected == True


def getDiskName(deskSign, model):
    [diskItem, _] = model.getTree("Tree").findControls({
        "type": "TreeItem",
        "name~": deskSign
    })
    print(diskItem.name())
    return diskItem.name()