from pytest_bdd import scenarios, scenario, given, when, then, parsers
import pytest
from test_i18n import *
from auto.sync_api import sync_auto

# 加载位于"../features"目录下的所有BDD剧本文件
scenarios("../features/validators.feature")


@pytest.fixture(scope="session")
def remote_worker():

    # 建立远程连接
    with sync_auto("ws://192.168.3.112:3131/ws") as auto:
        RunSettings = auto.runSettings
        QtAuto = auto.qtAuto
        RunSettings.set({"slowMo": 500, "reportSteps": True})
        modelQt = QtAuto.loadModel('models/model.tmodel')
        capabilities = auto.capabilities()
        install_path = capabilities['homePath']

        # 启动 Qt 应用程序
        QtAuto.launchQtProcessAsync([  # 针对系统不同传入多个启动路径，会自动选择可用的路径
            f"{install_path}/bin/validators",  # Linux
            f"{install_path}\\bin\\validators.exe",  # Windows
            f"/Applications/CukeTest.app/Contents/Frameworks/validators"  # Mac
        ])
        modelQt.getApplication("validators").exists(10)
        # 在测试运行之前的建立远程链接并启动应用（在 yield 之前的部分）
        yield auto
        # 在测试函数运行之后执行清理工作（在 yield 之后的部分）
        modelQt.getButton("pushButton").click()
        modelQt.getApplication("validators").quit()


@pytest.fixture(scope="session")
def modelQt(remote_worker):
    model = remote_worker.qtAuto.loadModel('models/model.tmodel')
    return model

""" 
- @given, @when, @then: pytest-bdd装饰器，用于定义测试的前提条件（Given）、操作步骤（When）和预期结果（Then）。
- parsers.parse: 解析器，用于解析步骤中的参数。
"""

@when(parsers.parse("输入最小值{input}"))
def input_min_number(input, modelQt):
    modelQt.getSpinBox("minVal").click()
    modelQt.getSpinBox("minVal").set(input)


@then(parsers.parse("最小结果应该为{expected}"))
def check_min_result(expected, modelQt, request):
    modelQt.getSpinBox("minVal").checkProperty("value", expected, "最小结果与预期不符")

    # 截屏并添加到测试报告中
    request.attach(modelQt.getGeneric("groupBox").takeScreenshot(), "image/png")


@when(parsers.parse("输入最大值{input}"))
def input_max_number(input, modelQt):
    modelQt.getSpinBox("maxVal").click()
    modelQt.getSpinBox("maxVal").set(input)


@then(parsers.parse("最大结果应该为{expected}"))
def check_max_result(expected, modelQt, request):
    modelQt.getSpinBox("maxVal").checkProperty("value", expected, "最大结果与预期不符")
    request.attach(modelQt.getGeneric("groupBox").takeScreenshot(), "image/png")
