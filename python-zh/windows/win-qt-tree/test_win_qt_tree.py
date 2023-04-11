from leanproAuto import WinAuto, Util
from pytest_html import extras
import json
import os

model = WinAuto.loadModel('model1.tmodel')


# 操作树节点对象（需要识别模型）
def test_operate_tree_node():
    treeItemName = 'Windows  (C:)'
    # 点击模型中的树节点{string}
    model.getTreeItem(treeItemName).click(0, 0, 1)

    treeItemName = 'Windows  (C:)'
    # 展开和折叠模型中的树节点{string}
    model.getTreeItem(treeItemName).expand()
    Util.delay(2000)
    model.getTreeItem(treeItemName).collapse()


# 操作树对象（不需要识别模型）
def test_operate_tree_objects(extra):
    pathString1 = '["Windows  (C:)", "Windows", "System32"]'
    # 点击树中的{string}
    treepath = json.loads(pathString1)
    model.getTree("Tree").select(treepath)

    pathString2 = '["Windows  (C:)", "Windows", "System32"]'
    # 折叠与展开树中的{string}
    treepath = json.loads(pathString2)
    model.getTree("Tree").showHeader(3)
    model.getTree("Tree").childCount(treepath)


# 访问目标路径
def test_access_target_path():
    relativePath = './conftest.py'
    # 访问并选中{string}文件
    treepath = os.path.abspath(relativePath).split('\\')
    tree = model.getTree('Tree')
    foundFlag = False
    # 由于磁盘名称不同这里为路径中的磁盘名做修改
    # 通过磁盘符（如"C:"）获取完整磁盘名称
    treepath[0] = getDiskName(treepath[0], model)
    print(treepath)
    item = tree.select(treepath)

    expectedItemName = 'conftest.py'
    # {string}节点选中
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