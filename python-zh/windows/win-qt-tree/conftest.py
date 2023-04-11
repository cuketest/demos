from leanproAuto import WinAuto, Util

install_path = "C:\\Program Files\\LeanPro\\CukeTest"
app_path = install_path + '\\bin\\dirview.exe'
context = {}
model = WinAuto.loadModel('model1.tmodel')


# 等效于 BeforeAll Hook，在第一个测试开始前被调用
def pytest_sessionstart(session):
    context["pid"] = Util.launchProcess(app_path)
    if not model.getWindow("Window").exists(5):
        raise Exception("Testing application was not launched.")


# 等效于 AfterAll Hook，在所有测试结束后被调用
def pytest_sessionfinish(session):
    Util.stopProcess(context['pid'])


# 等效于 Before Hook，在每个测试开始前被调用
def pytest_runtest_logstart(nodeid, location):
    ...


# 等效于 After Hook，在每个测试结束后被调用
def pytest_runtest_logfinish(nodeid, location):
    ...