from leanproAuto import WinAuto, Keyboard, Util
import sys
import os

context = {}
model = WinAuto.loadModel('./models/model1.tmodel')


# 等效于 BeforeAll Hook，在第一个测试开始前被调用
def pytest_sessionstart(session):
    install_path = os.path.dirname(os.path.dirname(sys.executable))
    context["pid"] = Util.launchProcess(f"{install_path}\\bin\\fetchmore.exe")
    if model.getWindow("Window").exists(5):
        model.getWindow("Window").restore()
        Keyboard.disableIme()
        # 禁用输入法
    else:
        raise Exception("Testing application was not launched.")
    # CukeTest.minimize()


# 等效于 AfterAll Hook，在所有测试结束后被调用
def pytest_sessionfinish(session):
    Util.stopProcess(context['pid'])


# 等效于 After Hook，在每个测试结束后被调用
def pytest_bdd_after_scenario(request, feature, scenario):
    screenshot = model.getWindow("Window").takeScreenshot()
    request.attach(screenshot, "image/png")
