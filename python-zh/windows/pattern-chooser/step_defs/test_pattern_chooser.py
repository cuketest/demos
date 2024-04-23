from leanproAuto import WinAuto, QtAuto, Util
from pytest_bdd import scenarios, given, when, then, parsers
from conftest import is_lite, model, modelWin, animationDur
import time
import json
import platform
import pytest

# 加载位于"../features"目录下的所有BDD剧本文件
scenarios("../features") 

""" 
- @given, @when, @then: pytest-bdd装饰器，用于定义测试的前提条件（Given）、操作步骤（When）和预期结果（Then）。
- parsers.parse: 解析器，用于解析步骤中的参数。
"""

@when(parsers.parse('循环点击四个图案{count:d}次并统计识别时间'))
def automation_for_appchooser(count, request):
    reports = []
    ptns = ["相机", "眼镜", "字典", "图标"]  # 定义要点击的图案列表
    for i in range(count):
        report = {}
        for ptn in ptns:
            beforeTime = int(round(time.time() * 1000))  # 记录点击前时间
            model.getPattern(ptn).click()  # 点击图案
            afterTime = int(round(time.time() * 1000))  # 记录点击后时间
            duration = afterTime - beforeTime  # 计算识别时间
            report[ptn] = str(duration) + 'ms'  # 将识别时间加入报告
        reports.append(report)

    # 将每个图案识别的时间添加到测试报告中
    request.attach(json.dumps(reports, ensure_ascii=False, indent='\t'))


# 测试图像自动化的API
@then('验证相机此时不居中')
def verify_camera_not_centered():
    Util.delay(animationDur)  # 延迟以等待动画完成
    result = model.getPattern('居中相机').exists(2)  # 检查居中相机图案是否存在
    assert result == False  # 断言结果应为False


@then('点击相机')
def click():
    model.getPattern('相机').click()


@then('验证相机此时居中')
def verify_camera_centered():
    Util.delay(animationDur)  # 延迟以等待动画完成
    result = model.getPattern('居中相机').exists(2)  # 检查居中相机图案是否存在
    assert result == True  # 断言结果应为True


@when(parsers.parse('点击级联虚拟控件{virtualName}'))
def click_cascade_virtual_controls(virtualName):
    # 针对Qt虚拟控件的特殊处理
    if virtualName.find('Qt') > -1:
        if is_lite:
            pytest.skip("Test is skipped on Lite Edition")  # Lite版跳过此测试
        model.getVirtual(virtualName).click()
    elif platform.system() == "Windows":
        modelWin.getVirtual(virtualName).click()  # 点击Windows虚拟控件
    else:
        # 非Windows平台跳过测试Windows虚拟控件
        pytest.skip("Test is skipped on non-Windows platforms")


@then('通过Windows控件虚拟化点击左上角')
@pytest.mark.skipif(platform.system() != "Windows", reason="Test is skipped on non-Windows platforms")
def virtualization_click_topLeft():
    panel = modelWin.getGeneric("Custom")
    virtual = panel.getVirtual()
    virtual.click(50, 50)  # 在左上角点击


@then('通过Qt控件虚拟化点击右上角')
@pytest.mark.skipif(is_lite, reason="Test is skipped on Lite Edition")
def virtualization_click_topRight():
    panel = model.getGraphicsView("GraphicsView")
    rect = panel.rect()  # 获取面板的矩形区域
    virtual = panel.getVirtual()
    virtual.click(rect.width - 50, 50)  # 在右上角点击
