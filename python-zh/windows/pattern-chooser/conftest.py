from leanproAuto import WinAuto, QtAuto, Util, RunSettings, CukeTest
import sys
import os
import pytest
import platform


# 获取当前CukeTest的版本信息，判断是否为Lite版
version = CukeTest.version()
is_lite = "Lite" in version
context = {}

# 操作动画持续时间设定为1000毫秒，在操作期间等待动画
animationDur = 1000

# 根据是否为Lite版加载对应的模型文件
if not is_lite:
    model = QtAuto.loadModel('./models/model1.tmodel')
else:
    model = WinAuto.loadModel('./models/model1.tmodel')

# Windows平台专用模型
if platform.system() == "Windows":
    modelWin = WinAuto.loadModel('models/model1.tmodel')
else:
    modelWin = None

# 设置运行参数
RunSettings.set({
    'reportSteps': True  # 开启步骤报告，输出每个自动化操作的详细信息
})


# 在所有测试开始前和结束后进行的设置
def pytest_sessionstart(session):
    print("Session start: setting up resources")
    # 可以添加更多在session开始时需要执行的代码


# 等效于 AfterAll Hook，在所有测试结束后被调用
def pytest_sessionfinish(session):
    print("Session finish: cleaning up resources")
    # 可以添加更多在session结束时需要执行的清理代码


# pytest的每个scenario开始前的钩子函数，等效于Before Hook
def pytest_bdd_before_scenario(request, feature, scenario):
    install_path = os.path.dirname(os.path.dirname(sys.executable))
    # 根据不同CukeTest版本使用不同的启动方式
    if not is_lite:
        context["pid"] = QtAuto.launchQtProcessAsync([
            os.path.join(install_path, "bin/appchooser.exe"),
            os.path.join(install_path, "bin/appchooser")
        ])
    else:
        context["pid"] = Util.launchProcess(
            f"{install_path}\\bin\\appchooser.exe")

    # 等待相机图标出现，最多等待5秒
    model.getPattern('相机').wait(5)


# pytest的每个scenario结束后的钩子函数，等效于After Hook
def pytest_bdd_after_scenario(request, feature, scenario):
    try:
        image = None

        # 对应用窗口进行截图并附加到测试报告中
        if not is_lite:
            image = model.getGraphicsView("GraphicsView").takeScreenshot()
        else:
            image = model.getCustom("Custom").takeScreenshot()
        request.attach(image, "image/png")

        # 关闭应用进程
        Util.stopProcess(context["pid"])
    except Exception as e:
        raise e
