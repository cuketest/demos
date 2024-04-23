from leanproAuto import QtAuto, Util
import pytest

modelQt = QtAuto.loadModel("models/model1.tmodel")
context = {}


# 等效于 BeforeAll Hook，在第一个测试开始前被调用
def pytest_sessionstart(session):
    context["pid"] = QtAuto.launchQtProcessAsync("D:\\stocqt\\stocqt.exe")
    modelQt.getApplication("stocqt").exists(30);


# 等效于 AfterAll Hook，在所有测试结束后被调用
def pytest_sessionfinish(session):
    Util.stopProcess(context["pid"])


# 等效于 Before Hook，在每个测试开始前被调用
def pytest_bdd_before_scenario(request, feature, scenario):
    ...
