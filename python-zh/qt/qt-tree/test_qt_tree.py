from leanproAuto import QtAuto, Util
from pytest_html import extras
import os
import json

model = QtAuto.loadModel('model.tmodel')


# 场景: 根据itemPath展开树树节点
def test_qt_tree_expand(extra):
    # 假如目标树节点的itemPath为"[0, 0]"，获取该树节点的对象
    itemPathString = "[0, 0]"
    itemPath = json.loads(itemPathString)
    targetItem = model.getTree("Dir_View").getItem(itemPath)
    if not targetItem:
        raise Exception("target TreeItem is not exist in this itemPath " + itemPathString)

    # 那么将目标树节点展开到可视范围内
    targetItem.scrollIntoView()

    # 那么选中目标树节点并验证
    select_and_check_target_item(model, itemPath)

    # 那么应用截图
    append_screenshot(model, extra)


# 场景: 根据文件路径展开并选中目标树节点
def test_qt_tree_expand_and_select(extra):
    # 假如展开到"./__pycache__"文件夹所在树节点
    relativePath = "__pycache__"
    workPath = os.path.join(os.getcwd(), relativePath)
    dirNamePath = workPath.split('\\')  # 将路径拆分成路径节点数组
    extra.append(extras.json(dirNamePath))
    tree = model.getTree('Dir_View')
    root = dirNamePath[0]  # 路径根节点需要特殊处理：
    if root == '':
        targetItem = tree.findItem('/')  # Linux系统中为`/`，在pathNodes中表现为空字符''
    else:
        rootNodeList = tree.children()
        for node in rootNodeList:
            nodeName = node.value()
            if not nodeName.find(root) == -1:
                targetItem = node
    dirNamePath[0] = targetItem.value()  # Windows系统中为磁盘名+磁盘符
    tree.scrollTo(dirNamePath)

    # 那么选中目标树节点并验证
    select_and_check_target_item(model, dirNamePath)

    # 那么应用截图
    append_screenshot(model, extra)


def append_screenshot(model, extra):
    screenshot = model.getTree("Dir_View").takeScreenshot()
    extra.append(extras.image(screenshot))


def select_and_check_target_item(model, itemPath):
    targetItem = model.getTree('Dir_View').getItem(itemPath)
    targetItem.scrollIntoView()  # 如果目标不在可点击区域内则会展开到该节点位置
    targetItem.expand()
    isChecked = targetItem.expanded()
    assert isChecked == True, "没有选中目标树节点"
