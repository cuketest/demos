from leanproAuto import WinAuto, QtAuto, Util
import os

install_path = "C:\\Program Files\\LeanPro\\CukeTest"
app_path = install_path + '\\bin\\appchooser.exe'
context = {}
model = WinAuto.loadModel('./models/model1.tmodel')


# 等效于 BeforeAll Hook，在第一个测试开始前被调用
def pytest_sessionstart(session):
    ...


# 等效于 AfterAll Hook，在所有测试结束后被调用
def pytest_sessionfinish(session):
    ...


# 等效于 Before Hook，在每个测试开始前被调用
def pytest_runtest_logstart(nodeid, location):
    # 启动应用并等待
    context["pid"] = QtAuto.launchQtProcessAsync([
        os.path.join(install_path, "bin/appchooser.exe"),
        os.path.join(install_path, "bin/appchooser")
    ])
    model.getPattern('相机').wait(5)

# 等效于 After Hook，在每个测试结束后被调用
def pytest_runtest_logfinish(nodeid, location):
    try:
        Util.stopProcess(context["pid"])
    except:
        return