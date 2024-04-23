from pytest_html import extras
import pytest
from data_reader import read_data_from_csv, read_data_from_txt, read_data_from_xlsx


# 简单数学计算
def test_simple_math():
    num1 = 1
    num2 = 1
    expected_sum = 2
    actual_sum = num1 + num2
    assert actual_sum == expected_sum, f"预期值为 {expected_sum}，实际结果为 {actual_sum}."


# 获取测试数据
def get_data():
    fixed_data = [(100, 5, 105), (101, 5, 106), (200, 5, 205), (300, 15, 315),
                  (400, 50, 450), (500, 60, 560)]
    print("固定的数据集：", fixed_data)

    # 示例：从文件读取数据
    data_csv = read_data_from_csv('test_data/data.csv')
    data_txt = read_data_from_txt('test_data/data.txt')
    data_xlsx = read_data_from_xlsx('test_data/data.xlsx')

    # 合并数据源
    data = fixed_data + data_csv + data_txt + data_xlsx
    return data


# 混合场景
@pytest.mark.parametrize("var,increment,result", get_data())
def test_mixed_scenario(var, increment, result):
    expected_sum = result
    actual_sum = var + increment
    assert actual_sum == expected_sum, f"预期值为 {expected_sum}，实际结果为 {actual_sum}."
