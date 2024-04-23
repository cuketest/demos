from leanproAuto import QtAuto, Util, RunSettings
import sys
import os

context = {}
model = QtAuto.loadModel('model.tmodel')

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


# 在所有测试结束后被调用，用于清理和结束测试会话
def pytest_sessionfinish(session):
    # 停止之前启动的 Qt 应用程序进程
    Util.stopProcess(context["pid"])


# 设置报告标题
def pytest_html_report_title(report):
    report.title = "Qt Notepad"
