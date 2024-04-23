import time
from pytest_bdd import scenarios, given, when, then, parsers
import pytest
from conftest import page

# 加载位于"../features"目录下的所有BDD剧本文件
scenarios("../features")

""" 
- @given, @when, @then: pytest-bdd装饰器，用于定义测试的前提条件（Given）、操作步骤（When）和预期结果（Then）。
- parsers.parse: 解析器，用于解析步骤中的参数。
"""

total = 0
@given(parsers.parse('打开浏览器并导航到"{url}"'))
def goto_page(url):
    page.goto(url)
    pageTitle = page.title()
    assert pageTitle == "Flux Cart"

@when("点击添加到购物车按钮")
def add_to_cart():
    page.click("#addToCart")

@then(parsers.parse('此时按钮文字应该为"{message}"'))
def verify_button_text(message):
    text = page.inner_text("#addToCart")
    assert text == message

@then(parsers.parse('弹出账单 "{bill}"'))
def pop_up_bill(bill):
    # Util.delay(1000)

    # 延迟1秒
    time.sleep(1)
    text = page.inner_text('.total')
    assert text == bill


@when(parsers.parse('添加{count:d}件"{itemName}"到购物车'))
def add_to_cart(count,itemName):
    global total
    # Item info which matching the option in page.
    itemList = {
        '40oz Bottle': {
            'value': '0', 'price': 4.99
        },
        '6 Pack': {
            'value': '1', 'price': 12.99
        },
        '30 Pack': {
            'value':'2', 'price': 19.99
        }
    }

    # 如果总价（total）不存在，则设为0
    total = total if total else 0
    addBtn = page.query_selector('#addToCart')
    for i in range(count):
        sleep()
        print("[value = {}]".format(itemList[itemName]['value']))
        page.select_option("select", itemList[itemName]['value'])
        if addBtn.inner_text() != "Sold Out":
            addBtn.click()
            total += itemList[itemName]['price']
        else:
            print(f"{itemName} sold out.")


@then("验证购物车总价符合预期")
def verify_the_total_price(request):
    global total
    text = page.inner_text('.total')
    cartTotal = float(text.split('$')[1])
    expectTotal = round(total, 2)  
    assert cartTotal == expectTotal

    # 将信息添加到测试报告中
    request.attach(f'预期价格为{expectTotal}，实际价格为{cartTotal}')

def sleep():
    INTERVAL = 3
    time.sleep(INTERVAL)
    # Util.delay(INTERVAL)    