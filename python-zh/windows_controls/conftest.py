from leanproAuto import sync_auto
install_path = "C:\\Program Files\\LeanPro\\CukeTest"
app_path = install_path+'\\bin\\SimpleStyles.exe'
context = {}
# 等效于 BeforeAll Hook，在第一个测试开始前被调用
def pytest_sessionstart(session):
    with sync_auto() as auto:
        context["pid"] = auto.util.launchProcess(app_path)
# 等效于 AfterAll Hook，在所有测试结束后被调用
def pytest_sessionfinish(session):
    with sync_auto() as auto:
        auto.util.stopProcess(context["pid"])
# 等效于 Before Hook，在每个测试开始前被调用
def pytest_runtest_logstart(nodeid, location):
    ...
# 等效于 After Hook，在每个测试结束后被调用
def pytest_runtest_logfinish(nodeid, location):
    ...