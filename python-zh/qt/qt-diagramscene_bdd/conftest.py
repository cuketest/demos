from leanproAuto import QtAuto, Util, Keyboard
import sys
import os

model = QtAuto.loadModel('models/model1.tmodel')
context = {}


# 等效于 BeforeAll Hook，在第一个测试开始前被调用
def pytest_sessionstart(session):
    install_path = os.path.dirname(os.path.dirname(sys.executable))
    context["pid"] = QtAuto.launchQtProcessAsync([  # 针对系统不同传入多个启动路径，会自动选择可用的路径
        f"{install_path}/bin/diagramscene",  # Linux
        f"{install_path}\\bin\\diagramscene.exe",  # Windows
        f"/Applications/CukeTest.app/Contents/Frameworks/diagramscene"  # Mac
    ])

    # 等待被测应用的进程出现，最长等待时间为10秒。
    model.getApplication("diagramscene").exists(10)
    
    # 将应用最大化方便后续绘图操作
    model.getWindow("Diagramscene1").maximize()

    # 禁用输入法
    Keyboard.disableIme()


# 等效于 AfterAll Hook，在所有测试结束后被调用
def pytest_sessionfinish(session):
    Util.stopProcess(context["pid"])


# 等效于 Before Hook，在每个测试开始前被调用
def pytest_bdd_before_scenario(request, feature, scenario):
    ...


# 等效于 After Hook，在每个测试结束后被调用
def pytest_bdd_after_scenario(request, feature, scenario):
    screenshot = model.getWindow("Diagramscene1").takeScreenshot()
    request.attach(screenshot, "image/png")