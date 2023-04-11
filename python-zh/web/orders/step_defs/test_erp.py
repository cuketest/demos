from pytest_bdd import scenarios, given, when, then, parsers
import pytest
from leanproWeb import WebAuto
from conftest import page
from utils import read_xlsx, find_order, format_excel_time

scenarios("../features")
@given(parsers.parse('打开网址"DemoErp"样例'))
def goto_home():
    # TODO: 应改为启动样例并直接访问样例地址
    # 当前需要手动启动并更改样例地址
    page.goto("http://localhost:20580/user/login")

@then(parsers.parse('输入用户名"{username}"，密码"{password}"，登录账号导航到指定页面'))
def login(username, password):
    page.click("[placeholder=\"用户名: admin or user\"]")
    page.fill("[placeholder=\"用户名: admin or user\"]", username)
    page.fill("[placeholder=\"密码: admin\"]", password)
    # with page.expect_navigation(url="http://localhost:20893/admin/list"):
    with page.expect_navigation():
        page.click("button:has-text(\"登 录\")")

@then(parsers.parse('点击“新建”按钮，读取excel文件"{xlsx_file}"，根据"{order_no}"将订单数据录入到系统'))
def new_order(xlsx_file, order_no):
    data = read_xlsx(xlsx_file)
    target_order = find_order(order_no, data)

    page.click("button:has-text(\"新建\")")
    page.click("[placeholder=\"请输入订单编号\"]")
    page.fill("[placeholder=\"请输入订单编号\"]", target_order["订单编号"])
    page.click('input#orderDate')
    page.fill('input#orderDate', format_excel_time(target_order["订单日期"]))
    page.press('[placeholder="请选择"]', 'Enter')
    page.click("input[role=\"combobox\"]")
    page.click(":nth-match(:text(\"{0}\"), 2)".format(target_order["客户"]))
    page.click('#deliveryDate')
    page.fill('#deliveryDate', format_excel_time(target_order["交货日期"]))
    page.press('[placeholder="请选择"]', 'Enter')
    page.fill("[placeholder=\"请填写\"]", target_order["收货地址"])
    page.fill("[placeholder=\"请输入\"]", target_order["联系人"])
    page.fill("#phone", target_order["电话"])
    page.fill("#total", str(target_order["金额总计（元）"]))

    # Click button:has-text("提 交")
    page.click("button:has-text(\"提 交\")")
    # page.click("button:has-text(\"返 回\")")

@when(parsers.parse('检查填写结果是否为"{result}"'))
def assert_order(result):
    ...

@given(parsers.parse('删除录入"{result}"的订单"{order_no}"'))
def delete_order(result, order_no):
    page.click("text={0}".format(order_no))

    # Click button:has-text("删除")
    page.click("button:has-text(\"删除\")")


@then(parsers.parse('验证订单"{order_no}"是否删除成功'))
def assert_delete(order_no):
    ...
