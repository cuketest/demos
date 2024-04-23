from leanproAuto import QtAuto, Util
import pytest
import sys
import os
import platform

install_path = os.path.dirname(os.path.dirname(sys.executable))
context = {}


@pytest.fixture
def get_install_path():
    if get_os_type() == 'macOS':
        target_dir = os.path.join(install_path, 'Frameworks')
    else:
        target_dir = os.path.join(install_path, 'bin')
    return target_dir


# 等效于 BeforeAll Hook，在第一个测试开始前被调用
def pytest_sessionstart(session):
    context["pid"] = QtAuto.launchQtProcessAsync([  # 针对系统不同传入多个启动路径，会自动选择可用的路径
        f"{install_path}/bin/fetchmore",  # Linux
        f"{install_path}\\bin\\fetchmore.exe",  # Windows
        f"/Applications/CukeTest.app/Contents/Frameworks/fetchmore"  # Mac
    ])


# 等效于 AfterAll Hook，在所有测试结束后被调用
def pytest_sessionfinish(session):
    Util.stopProcess(context["pid"])


# 等效于 Before Hook，在每个测试开始前被调用
def pytest_runtest_logstart(nodeid, location):
    ...


# 等效于 After Hook，在每个测试结束后被调用
def pytest_runtest_logfinish(nodeid, location):
    ...


def get_os_type():
    system = platform.system()
    if system == 'Darwin':
        return 'macOS'
    elif system == 'Windows':
        return 'Windows'
    elif system == 'Linux':
        return 'Linux'
    else:
        return 'Unknown'
