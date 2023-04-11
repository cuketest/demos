from leanproAuto import WinAuto, Keyboard, Util
import pytest

install_path = "C:\\Program Files\\LeanPro\\CukeTest"
app_path = install_path + '\\bin\\fetchmore.exe'
context = {}


model = WinAuto.loadModel('./models/model1.tmodel')


# 等效于 BeforeAll Hook，在第一个测试开始前被调用
def pytest_sessionstart(session):
    context["pid"] = Util.launchProcess(app_path)
    if model.getWindow("Window").exists(5):
        model.getWindow("Window").restore()
        Keyboard.disableIme(); # 禁用输入法
    else:
        raise Exception("Testing application was not launched.")
    # CukeTest.minimize()


# 等效于 AfterAll Hook，在所有测试结束后被调用
def pytest_sessionfinish(session):
    Util.stopProcess(context['pid']); 
