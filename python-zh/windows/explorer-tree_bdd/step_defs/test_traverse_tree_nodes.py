from leanproAuto import WinAuto, Util
from pytest_bdd import scenarios, given, when, then, parsers
from pytest_html import extras

model = WinAuto.loadModel("./models/model1.tmodel")
scenarios("../features")

MAX_DEPTH = 3  # 遍历的最大深度，如3就代表最多展开三级节点
result = []  # 记录遍历节点的名称和深度信息用于生成记录，成员为{name, depth}对象


@given("打开资源管理器")
def open_explorer():
    # 如果当前有资源管理器窗口打开就直接用当前窗口
    if model.getWindow("Window").exists():
        model.getWindow("Window").restore()
    else:
        Util.launchProcess("explorer")
    if not model.getWindow("Window").exists(5):
        raise Exception("资源管理器没有正常启动")


@when(parsers.parse("遍历展开{tree}"))
def expand_tree(tree):
    depth = 0
    model.getTree(tree).scrollToTop()
    RootNode = model.getTree(tree).firstChild("TreeItem")  # 获取树中的第一个`TreeItem`子节点
    if RootNode:
        expandChild(RootNode, depth)
    else:
        raise Exception('当前%s树中没有任何树节点。', tree)


@then("将结果附件")
def attach_result(extra):
    report = ""
    for row in result:
        print(row)
        rowString = '\t' * row['depth'] + row['name'] + '\n'
        report += rowString
    extra.append(extras.text(report))


def expandChild(node, depth):
    """
    :param node: 当前被正在被遍历的控件节点，可以是任何控件类型；
    :param depth: 当前递归所在的深度，到达最大深度后会停止继续递归； 
    :return: 没有任何返回值，节点信息都会写入到上下文中的result数组中。
    """
    node.expand()  # 展开目标节点
    node.highlight(1000)  # 高亮目标节点
    nodeName = node.name()
    result.append({'name': nodeName, 'depth': depth})

    #  是否有子节点，如果有则递归进入子节点的遍历
    #  但是没有子节点不一定就是叶子节点
    childNode = node.firstChild("TreeItem")
    if childNode and depth + 1 < MAX_DEPTH:
        expandChild(childNode, depth + 1)
    #  跳出子节点的遍历后继续下一个兄弟节点的遍历
    #  没有下一个兄弟节点就结束
    nextNode = node.next()
    if nextNode:
        expandChild(nextNode, depth)
    else:
        return
