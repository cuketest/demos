from leanproAuto import QtAuto, Util, Keyboard, Auto
from pytest_bdd import scenarios, scenario, given, when, then, parsers
import pytest
import os
import base64

# 加载Qt应用程序的UI模型文件
model = QtAuto.loadModel('models/model1.tmodel')

# 加载位于"../features"目录下的所有BDD剧本文件
scenarios("../features")

""" 
- @given, @when, @then: pytest-bdd装饰器，用于定义测试的前提条件（Given）、操作步骤（When）和预期结果（Then）。
- parsers.parse: 解析器，用于解析步骤中的参数。
"""

@given(parsers.parse('用户选择"{shape}"形状并将其添加到工作区x坐标{x:d}，y坐标{y:d}'))
def add_shape_to_workspace(shape, x, y):
    model.getButton(shape).click()

    # 延迟0.5秒执行
    Util.delay(500)
    model.getGraphicsView("QGraphicsView").clickScene(x, y)

@then(parsers.parse('工作区应该显示"{shape1}"和"{shape2}"形状'))
def verify_workspace_display(shape1, shape2):
    map = {"Process": "ProcessItem", "Conditional": "ConditionalItem"}
    model.getGraphicsItem(map[shape1]).exists(5)
    model.getGraphicsItem(map[shape2]).exists(5)

@when('用户使用箭头工具连接这两个形状')
def connect_shapes_with_arrow():
    model.getButton("arrow").click()
    model.getGraphicsItem("ProcessItem").drag()
    model.getGraphicsItem("ConditionalItem").drop()

@then('这两个形状应该被一条箭头连接')
def verify_shapes_connected():

    # 断言箭头存在
    assert model.getGraphicsItem("arrowItem").exists(), '箭头不存在'

@given(parsers.parse('用户选择了一个已添加的形状"{shape}"'))
def select_added_shape(shape):
    model.getGraphicsItem(shape).click()

@when(parsers.parse('用户更改该形状的颜色为"{color}"'))
def change_shape_color(color):
    rect = model.getButton("QToolButton").rect()

    # 控制点击坐标位置，点击按钮右边的下拉才能打开下拉框
    model.getButton("QToolButton").click(rect.width-3, rect.height/2)
    model.getMenu("QMenu").exists(5)
    model.getMenuItem(color).click()

@then('该形状的颜色应该变为红色')
def verify_shape_color():

    # 滚动到视图位置
    model.getGraphicsItem("ProcessItem").scrollIntoView()

    # 检查对象截屏是否与期望图片一致
    model.getGraphicsItem("ProcessItem").checkImage()

@given('用户选择了一个连接箭头')
def select_connected_arrow():
    rect = model.getGraphicsItem("arrowItem").rect()

    # 控制点击坐标位置，点击箭头
    model.getGraphicsItem("arrowItem").click(rect.width/2+1, rect.height/2+1)

@when(parsers.parse('用户更改该箭头的颜色为"{color}"'))
def change_arrow_color(color):
    rect = model.getButton("QToolButton1").rect()

    # 控制点击坐标位置，点击按钮右边的下拉才能打开下拉框
    model.getButton("QToolButton1").click(rect.width - 3, rect.height / 2)
    model.getMenuItem(color).click()

@then(parsers.parse('该箭头的颜色应该变为"{color}"'))
def verify_arrow_color(color):
    model.getGraphicsItem("arrowItem").scrollIntoView()
    model.getGraphicsItem("arrowItem").checkImage()

@given(parsers.parse('用户在工作区坐标x{x:d}，坐标y{y:d}添加了一个文本框'))
def add_text_box_to_workspace(x, y):
    model.getButton("Text").click()

    # 点击场景坐标
    model.getGraphicsView("QGraphicsView").clickScene(x, y)

@when(parsers.parse('用户在文本框中输入"{text}"'))
def enter_text_in_textbox(text):

    # 模拟键盘输入
    Keyboard.pressKeys(text)

@when(parsers.parse('用户更改文本的字体为"{font}"，样式为"{weight}"，并添加下划线'))
def change_text_font_and_style(font, weight):
    model.getComboBox("QComboBox").select(font)
    model.getButton(weight).click()
    model.getButton("Underline").click()
    Util.delay(2000)

@then(parsers.parse('文本框中的文本应该显示为"{text}"加粗字体，并带有下划线'))
def verify_text_display(text,request):
    try:
        model.getGraphicsItem("TextItem").checkImage()
    except Exception as err:

        # 获取本地所期望的字体图片数据
        expected_image_data = model.getGraphicsItem("TextItem").modelImage()

        # 获取当前设置的字体图片数据
        tmpdir = os.path.join(os.getcwd(), 'testcache')
        screenshot_path = os.path.join(tmpdir, 'expected_image.png')
        model.getGraphicsItem("TextItem").takeScreenshot(screenshot_path)
        with open(screenshot_path, 'rb') as image_file:
            actual_image_data = image_file.read()
        
        # 将数据转为base64,方便做比对处理
        expected_image_data_base64 = base64.b64encode(expected_image_data).decode('utf-8')
        actual_image_data_base64 = base64.b64encode(actual_image_data).decode('utf-8')

        # 校验图片是否相等,允许的最大像素百分比差异容忍度为1,且忽略图像中的额外部分
        equal_result = Auto.visual.image.imageEqual(actual_image_data_base64, expected_image_data_base64, {"pixelPercentTolerance": 1})
        print('equal_result:', equal_result)

        compare_result = Auto.visual.image.imageCompare(actual_image_data_base64, expected_image_data_base64, {"pixelPercentTolerance": 1})
        # print('compare_result:', compare_result["diffImage"])

        # 生成差异图添加到测试报告中
        diff_image_data = base64.b64decode(compare_result["diffImage"])
        diff_image = os.path.join(tmpdir, 'diff_image.png')
        with open(diff_image, "wb") as f:
                f.write(diff_image_data)
        Util.delay(1000)
        request.attach(compare_result["diffImage"], "image/png")
        print(f"对比图片已保存至 {diff_image}")
        assert equal_result, '字体比对与预期不一样'
@given('用户已经在工作区添加了形状和文本，并已经进行了连接')
def add_shapes_text_and_connection(request):
    model.getGraphicsItem("ProcessItem").exists()
    model.getGraphicsItem("ConditionalItem").exists()
    model.getGraphicsItem("arrowItem").exists()
    model.getGraphicsItem("TextItem").exists()
    screenshot = model.getGraphicsView("QGraphicsView").takeScreenshot()
    request.attach(screenshot, "image/png")

@when(parsers.parse('用户对画布进行缩放操作，缩放比例"{scale}"'), target_fixture="rect")
def zoom_canvas(scale):
    ProcessItemRect = model.getGraphicsItem("ProcessItem").rect()
    ConditionalItemRect = model.getGraphicsItem("ConditionalItem").rect()
    arrowItemRect = model.getGraphicsItem("arrowItem").rect()
    TextItemRect = model.getGraphicsItem("TextItem").rect()
    model.getComboBox("zoom").select(scale)

    rect ={
        'ProcessItemRect': ProcessItemRect,
        'ConditionalItemRect': ConditionalItemRect,
        'arrowItemRect': arrowItemRect,
        'TextItemRect': TextItemRect,
        'scale': scale
    }
    return rect

@then('形状和文本应该按照缩放比例正确显示')
def verify_zoom_display(rect):
    scale = rect["scale"]
    ProcessItemRect = model.getGraphicsItem("ProcessItem").rect()
    ConditionalItemRect = model.getGraphicsItem("ConditionalItem").rect()
    arrowItemRect = model.getGraphicsItem("arrowItem").rect()
    TextItemRect = model.getGraphicsItem("TextItem").rect()
    print('TextItemRect=', TextItemRect)    
    scale = scale.replace('%', '')
    num = float(scale) / 100
    print('num=',num)

    model.getGraphicsItem("ProcessItem").exists()
    model.getGraphicsItem("ConditionalItem").exists()
    model.getGraphicsItem("arrowItem").exists()
    model.getGraphicsItem("TextItem").exists()

    print(TextItemRect.width , rect["TextItemRect"].width)

    assert round(ProcessItemRect.width / rect["ProcessItemRect"].width, 1) == num
    assert round(ProcessItemRect.height / rect["ProcessItemRect"].height, 1) == num
    assert round(ConditionalItemRect.width / rect["ConditionalItemRect"].width, 1) == num
    assert round(ConditionalItemRect.height / rect["ConditionalItemRect"].height, 1) == num
    assert round(arrowItemRect.width / rect["arrowItemRect"].width, 1) == num
    assert round(arrowItemRect.height / rect["arrowItemRect"].height, 1) == num
    assert round(TextItemRect.width / rect["TextItemRect"].width, 1) == num
    assert round(TextItemRect.height / rect["TextItemRect"].height, 1) == num

@when('用户在缩放后的画布上添加新的形状和文本')
def add_new_shapes_text_on_zoomed_canvas():
    model.getButton("I/O").click()
    model.getGraphicsView("QGraphicsView").clickScene(500, 1000)
    model.getButton("Conditional").click()
    model.getGraphicsView("QGraphicsView").clickScene(800, 1000)
    model.getButton("Text").click()
    model.getGraphicsView("QGraphicsView").clickScene(500, 1200)
    Keyboard.pressKeys("示例文本2")

@when('用户创建新的连接线')
def create_new_connection_line():
    model.getButton("arrow").click()
    model.getGraphicsItem("I/OItem").drag()
    model.getGraphicsItem("ConditonalItem2").drop()

@then('新添加的形状和文本应该被正确显示并连接')
def verify_new_shapes_text_connection():
    model.getGraphicsItem("I/OItem").exists()
    model.getGraphicsItem("ConditonalItem2").exists()
    model.getGraphicsItem("arrowItem2").exists()
    model.getGraphicsItem("TextItem2").exists()
