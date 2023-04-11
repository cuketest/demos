from pytest_html import extras
import pytest


# 简单数学计算
def test_simple_math():
    num1 = 1
    # 初始值设为{int}
    sum = num1

    num2 = 1
    # 现在再加{int}
    sum += num2

    num3 = 2
    # 结果为{int}
    if sum != num3:
        raise Exception('预期值为 ' + num3 + ' 实际结果为 ' + sum + '.')


#混合场景
@pytest.mark.parametrize("var,increment,result",
                         [(100, 5, 105), (101, 5, 106), (200, 6, 205),
                          (300, 15, 315), (400, 50, 450), (500, 60, 560)])
def test_mixed_scenario(var, increment, result):
    num1 = var
    # 初始值设为{int}
    sum = num1

    num2 = increment
    # 现在再加{int}
    sum += num2

    num3 = result
    # 结果为{int}
    if sum != num3:
        raise Exception('预期值为 %d  实际结果为 %d .' % (num3, sum))
