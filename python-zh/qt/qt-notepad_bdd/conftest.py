from leanproAuto import QtAuto, Util, RunSettings
import sys
import os

context = {}
model = QtAuto.loadModel('models/model.tmodel')

RunSettings.set({
    'reportSteps': True
})


# 在会话开始前被调用，用于启动测试前的准备工作
def pytest_sessionstart(session):
    install_path = os.path.dirname(os.path.dirname(sys.executable))

    # 启动 Qt 应用程序进程，根据不同的操作系统选择可用的路径
    context["pid"] = QtAuto.launchQtProcessAsync([
        f"{install_path}/bin/notepad",  # Linux
        f"{install_path}\\bin\\notepad.exe",  # Windows
        f"/Applications/CukeTest.app/Contents/Frameworks/notepad"  # Mac
    ])

    # 等待 "notepad" 应用程序启动并确保其存在
    model.getApplication("notepad").exists(10)


# 等效于 AfterAll Hook，在所有测试结束后被调用
def pytest_sessionfinish(session):
    # 停止之前启动的 Qt 应用程序进程
    Util.stopProcess(context["pid"])


# 等效于 Before Hook，在每个测试开始前被调用
def pytest_bdd_before_scenario(request, feature, scenario):
    ...


# 等效于 After Hook，在每个测试结束后被调用
def pytest_bdd_after_scenario(request, feature, scenario):
    ...
