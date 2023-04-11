from pytest_bdd import scenarios, given, when, then, parsers
import pytest

scenarios("../features")
# 简单数学计算


@pytest.fixture
def nums():
    return {}


@given(parsers.parse("初始值设为{num1:d}"))
def init_nums(nums, num1):
    nums["var"] = num1


@when(parsers.parse("现在再加{increment:d}"))
def add(nums, increment):
    nums["increment"] = increment


@then(parsers.parse("结果为{result:d}"))
def result(nums, result):
    assert nums["var"] + nums["increment"] == result
