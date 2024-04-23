import pytest
import os
import shutil
from pathlib import Path

# 等效于 BeforeAll Hook，在第一个测试开始前被调用
def pytest_sessionstart(session):
    print(os.path.join(os.getcwd(), 'testing-cache'))
    try:
        shutil.rmtree(os.path.join(os.getcwd(), 'testing-cache'))
    except:
        pass
    finally:
        os.makedirs(os.path.join(os.getcwd(), 'testing-cache'))
        os.makedirs(os.path.join(os.getcwd(), 'testing-cache\\screenshots'))


# 等效于 AfterAll Hook，在所有测试结束后被调用
def pytest_sessionfinish(session):
    ...