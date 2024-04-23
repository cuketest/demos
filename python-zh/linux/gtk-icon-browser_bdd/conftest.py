from leanproAuto import AtkAuto, Util
import sys
import os
import platform

# 获取当前系统的操作系统名称
current_platform = platform.system()
model = AtkAuto.loadModel('models/model1.tmodel')
context = {}


# 等效于 BeforeAll Hook，在第一个测试开始前被调用
def pytest_sessionstart(session):
    if current_platform == "Windows":
        print("当前系统不是Linux，无法进行GTK自动化")
        result = "skipped"
        return result
    context["pid"] = Util.launchProcess('/usr/lib/cuketest/bin/gtk3-icon-browser')


# 等效于 AfterAll Hook，在所有测试结束后被调用
def pytest_sessionfinish(session):
    Util.stopProcess(context["pid"])


# 等效于 Before Hook，在每个测试开始前被调用
def pytest_bdd_before_scenario(request, feature, scenario):
    ...


# 等效于 After Hook，在每个测试结束后被调用
def pytest_bdd_after_scenario(request, feature, scenario):
    screenshot = model.getGeneric("Icon_Browser").takeScreenshot()
    request.attach(screenshot, "image/png")