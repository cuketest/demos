from pytest_bdd import scenarios, given, when, then, parsers
import pytest

scenarios("../features")
# 简单数学计算


@pytest.fixture
def nums():
    return {}


@given(parsers.parse("初始值设为{var:d}"))
def init_nums(nums, var):
    nums["var"] = var


@when(parsers.parse("现在再加{increment:d}"))
def add(nums, increment):
    nums["increment"] = increment


@then(parsers.parse("结果为{result:d}"))
def result(nums, result):
    expected_sum = result
    actual_sum = nums["var"] + nums["increment"]
    assert actual_sum == expected_sum, f"预期值为 {expected_sum}，实际结果为 {actual_sum}."
