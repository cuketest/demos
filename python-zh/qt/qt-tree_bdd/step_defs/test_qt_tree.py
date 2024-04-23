from leanproAuto import QtAuto, Util
from pytest_bdd import scenarios, given, when, then, parsers
import os
import json

# 加载Qt应用程序的UI模型文件
model = QtAuto.loadModel('models/model.tmodel')

# 加载位于"../features"目录下的所有BDD剧本文件
scenarios("../features")

""" 
- @given, @when, @then: pytest-bdd装饰器，用于定义测试的前提条件（Given）、操作步骤（When）和预期结果（Then）。
- parsers.parse: 解析器，用于解析步骤中的参数。
"""

# 场景: 根据itemPath展开树树节点
@given(parsers.parse('目标树节点的itemPath为"{treeItemName}"，获取该树节点的对象'), target_fixture = "target")
def get_tree_node(treeItemName):
    itemPathString = "[0, 0]"
    itemPath = json.loads(itemPathString)
    targetItem = model.getTree("Dir_View").getItem(itemPath)
    if not targetItem:
        raise Exception("target TreeItem is not exist in this itemPath " + itemPathString)
    return {"targetItem":targetItem, "dirNamePath":itemPath}


@then('将目标树节点展开到可视范围内')
def scroll_into_view(target):
    targetItem = target['targetItem']
    targetItem.scrollIntoView()


@then("选中目标树节点并验证")
def select_and_check_target_item(target):
    dirNamePath = target['dirNamePath']
    targetItem = model.getTree('Dir_View').getItem(dirNamePath)
    targetItem.scrollIntoView()  # 如果目标不在可点击区域内则会展开到该节点位置
    targetItem.expand()

    # 检查目标项是否已展开，未展开则显示指定输出信息
    targetItem.checkProperty("expanded", True, "没有选中目标树节点")


# 场景: 根据文件路径展开并选中目标树节点
@given(parsers.parse('展开到"{relativePath}"文件夹所在树节点'), target_fixture = "target")
def expend_tree_node(relativePath, request):
    workPath = os.path.join(os.getcwd(), relativePath)
    dirNamePath = workPath.split(os.path.sep)  # 将路径拆分成路径节点数组
    request.attach(f'pathNodes: [{dirNamePath}]')
    tree = model.getTree('Dir_View')
    root = dirNamePath[0]  # 路径根节点需要特殊处理：
    if root == '':
        targetItem = tree.findItem(os.path.sep)  # Linux系统中根目录为`/`，在pathNodes中表现为空字符''
    else:
        rootNodeList = tree.children()
        for node in rootNodeList:
            nodeName = node.value()
            if not nodeName.find(root) == -1:
                targetItem = node
    dirNamePath[0] = targetItem.value()  # Windows系统中为磁盘名+磁盘符
    tree.scrollTo(dirNamePath)
    return {"dirNamePath":dirNamePath}

