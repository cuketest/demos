from leanproAuto import sync_auto
import sys
import os

context = {}


# 等效于 BeforeAll Hook，在第一个测试开始前被调用
def pytest_sessionstart(session):
    install_path = os.path.dirname(os.path.dirname(sys.executable))
    app_path = f"{install_path}\\bin\\SimpleStyles.exe"
    with sync_auto() as auto:
        context["pid"] = auto.util.launchProcess(app_path)


# 等效于 AfterAll Hook，在所有测试结束后被调用
def pytest_sessionfinish(session):
    with sync_auto() as auto:
        auto.util.stopProcess(context["pid"])


# 等效于 Before Hook，在每个测试开始前被调用
def pytest_bdd_before_scenario(request, feature, scenario):
    ...


# 等效于 After Hook，在每个测试结束后被调用
def pytest_bdd_after_scenario(request, feature, scenario):
    ...