from pytest_bdd import scenarios, given, when, then, parsers
import pytest
from conftest import page

# 加载位于"../features"目录下的所有BDD剧本文件
scenarios("../features")

""" 
- @given, @when, @then: pytest-bdd装饰器，用于定义测试的前提条件（Given）、操作步骤（When）和预期结果（Then）。
- parsers.parse: 解析器，用于解析步骤中的参数。
"""

@given(parsers.parse('打开网站首页"{url}"'))
def open_newPage(url):
    # Go to https://cuketest.github.io/apps/shopping/
    page.goto(url)


@when("点击Pay parking到表单提交页面")
def click():
    # Click text=/.*Pay parking.*/
    page.click('text=/.*Pay parking.*/')
    # assert page.url() == 'https://cuketest.github.io/apps/shopping/pagar-estacionamento.html'


@when(parsers.parse("输入表单数据，点击Paying按钮\n{table}"), target_fixture="tableData")
def enter_form_data(table):
    parsed_table = parse_table_string(table)
    tableData = [dict(zip(parsed_table[0], row)) for row in parsed_table[1:]]
    # 获取table中的值
    tableData = tableData[0]

    ticketNum = tableData['TICKET']
    creditCard = tableData['CREDIT CARD']
    dueDate = tableData['DUE DATE']
    code = tableData['CODE']

    # Fill input[name="ticketnum"]
    page.fill('input[name="ticketnum"]', ticketNum)

    # Fill input[name="creditcard"]
    page.fill('input[name="creditcard"]', creditCard)

    # Fill input[name="duetime"]
    page.fill('input[name="duetime"]', dueDate)

    # Fill input[name="code"]
    page.fill('input[name="code"]', code)

    # Click button[type="submit"]
    page.click('button[type="submit"]')

    return tableData


@then("在Payment 页面中能够显示出上述表单中输入的值")
def validate_form_data(tableData):

    # 断言页面的值是否与预期一致
    assert tableData['TICKET'] == page.inner_text('[data-label="Ticket Number"]'), '页面中的Ticket Number值与表单中的TICKET值不相等'
    assert tableData['CREDIT CARD'] == page.inner_text('[data-label="Credit card"]'), '页面中的Credit card值与表单中的CREDIT CARD值不相等'
    assert tableData['DUE DATE'] == page.inner_text('[data-label="Due Date"]'), '页面中的Due Date值与表单中的DUE DATE值不相等'
    assert tableData['CODE'] == page.inner_text('[data-label="Code"]'), '页面中的Code值与表单中的CODE值不相等'


# 解析步骤中的Data Table
def parse_table_string(table_string):
    parsed_table = []
    rows = table_string.strip().split('\n')
    for row in rows:
        # 将每一行按 '|' 分割，并去除首尾空格
        cells = [cell.strip() for cell in row.split('|') if cell.strip()]
        if cells:
            parsed_table.append(cells)

    return parsed_table
