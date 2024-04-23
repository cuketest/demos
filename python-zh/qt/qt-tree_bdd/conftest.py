from leanproAuto import QtAuto, Util
import sys
import os

model = QtAuto.loadModel('models/model.tmodel')
context = {}


# 等效于 BeforeAll Hook，在第一个测试开始前被调用
def pytest_sessionstart(session):
    install_path = os.path.dirname(os.path.dirname(sys.executable))
    context["pid"] = QtAuto.launchQtProcessAsync([  # 针对系统不同传入多个启动路径，会自动选择可用的路径
        f"{install_path}/bin/dirview",  # Linux
        f"{install_path}\\bin\\dirview.exe",  # Windows
        f"/Applications/CukeTest.app/Contents/Frameworks/dirview"  # Mac
    ])


# 等效于 AfterAll Hook，在所有测试结束后被调用
def pytest_sessionfinish(session):
    Util.stopProcess(context["pid"])


# 等效于 Before Hook，在每个测试开始前被调用
def pytest_bdd_before_scenario(request, feature, scenario):
    ...


# 等效于 After Hook，在每个测试结束后被调用
def pytest_bdd_after_scenario(request, feature, scenario):
    screenshot = model.getWindow("Dir_View").takeScreenshot()
    request.attach(screenshot, "image/png")
