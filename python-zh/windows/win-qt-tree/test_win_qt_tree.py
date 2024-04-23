from leanproAuto import WinAuto, Util
from pytest_html import extras
import json
import os
import pytest

model = WinAuto.loadModel('model1.tmodel')


# 操作树节点对象（需要识别模型）
# 这个装饰器用于参数化测试
@pytest.mark.parametrize("treeItemName", ['C:'])
def test_operate_tree_node(treeItemName, extra):
    # 点击模型中的树节点
    model.getTreeItem(treeItemName).click(0, 0, 1)

    # 控件截图并添加到测试报告中
    extra.append(extras.image(model.getWindow("Window").takeScreenshot()))

    # 展开和折叠模型中的树节点
    model.getTreeItem(treeItemName).expand()
    Util.delay(2000)
    extra.append(extras.image(model.getWindow("Window").takeScreenshot()))
    model.getTreeItem(treeItemName).collapse()
    extra.append(extras.image(model.getWindow("Window").takeScreenshot()))


# 操作树对象（不需要识别模型）
@pytest.mark.parametrize("pathString", ['["C:", "Windows", "System32"]'])
def test_operate_tree_objects(pathString, extra):
    # 点击树中的节点
    treepath = json.loads(pathString)
    treepath[0] = getDiskName(treepath[0],model) # 处理磁盘符名称
    model.getTree("Tree").select(treepath)
    extra.append(extras.image(model.getWindow("Window").takeScreenshot()))

    # 折叠与展开树中的节点
    treepath = json.loads(pathString)
    model.getTree("Tree").showHeader(3)
    model.getTree("Tree").childCount(treepath)
    extra.append(extras.image(model.getWindow("Window").takeScreenshot()))


# 访问目标路径
@pytest.mark.parametrize("relativePath, expectedItemName", [('./conftest.py','conftest.py')])
def test_access_target_path(relativePath, expectedItemName, extra):
    # 访问并选中文件
    treepath = os.path.abspath(relativePath).split('\\')
    tree = model.getTree('Tree')
    foundFlag = False
    
    treepath[0] = getDiskName(treepath[0], model)
    item = tree.select(treepath)
    # 判断操作结果，并在报告中附上截图
    extra.append(extras.image(model.getWindow("Window").takeScreenshot()))
    itemName = item.name()

    # 检查name和focused属性是否符合预期值，否则输出指定信息
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
