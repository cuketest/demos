from leanproAuto import WinAuto
import os
import shutil
import pytest

projectPath = os.getcwd() + '\\testcache\\'
model = WinAuto.loadModel('./models/model1.tmodel')


# 等效于 BeforeAll Hook，在第一个测试开始前被调用
def pytest_sessionstart(session):
    if os.path.exists(projectPath):
        shutil.rmtree(projectPath)
    os.mkdir(projectPath)
    # CukeTest.minimize()


# 等效于 AfterAll Hook，在所有测试结束后被调用
def pytest_sessionfinish(session):
    model.getWindow("记事本").close()
    # CukeTest.restore()
    # CukeTest.maximize()
