from leanproAuto import WinAuto
import os
import shutil
import platform

projectPath = os.getcwd() + '\\testcache\\'
model = WinAuto.loadModel('model1.tmodel')


# 等效于 BeforeAll Hook，在第一个测试开始前被调用
def pytest_sessionstart(session):
    if getOSname() == 'Windows 11':
        raise Exception("请在 Windows10 或 Windows7 中运行本项目")
    if os.path.exists(projectPath):
        shutil.rmtree(projectPath)
    os.mkdir(projectPath)
    # CukeTest.minimize()


# 等效于 AfterAll Hook，在所有测试结束后被调用
def pytest_sessionfinish(session):
    # ...
    model.getWindow("记事本").close()
    # CukeTest.restore()
    # CukeTest.maximize()


# 等效于 Before Hook，在每个测试开始前被调用
def pytest_runtest_logstart(nodeid, location):
    ...


# 等效于 After Hook，在每个测试结束后被调用
def pytest_runtest_logfinish(nodeid, location):
    ...


def getOSname():
    osRelease = platform.platform()
    osReleaseSplit = osRelease.split('.')[-1].split('-')
    osReleaseTail = osReleaseSplit[0]
    if int(osReleaseTail) > 20000:
        return 'Windows 11'
    else:
        return 'Windows 10'
