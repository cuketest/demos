from pytest_bdd import scenarios, scenario, given, when, then, parsers
from leanproAuto import QtAuto, Util, RunSettings
import pytest
import os

# 设置慢动作,每个操作间隔0.5秒
RunSettings.set({'slowMo': 500})

# 加载Qt应用程序的UI模型文件
modelQt = QtAuto.loadModel("models/model1.tmodel")

# 加载位于"../features"目录下的所有BDD剧本文件
scenarios("../features")


@when('在股票列表中选择 AAPL')
def select_aapl_stock():
    modelQt.getQuick("QQuickRectangle").click()


@then('应该看到股票代码、公司名称、当前价格和价格变动')
def check_stock_info():

    # 检车各控件text属性是否符合预期值
    modelQt.getQuick("stockIdText").checkProperty("text", "AAPL")
    modelQt.getQuick("price").checkProperty("text", "169.23")
    modelQt.getQuick("stockNameText").checkProperty("text", "Apple Inc.")
    modelQt.getQuick("priceChange").checkProperty("text", "-1.85")
    modelQt.getQuick("priceChangePercentage").checkProperty("text", "(-1.08%)")


@when('切换行情视图为近六月')
def switch_to_six_month_view():
    modelQt.getQuick("halfYearlyButton").click()


@when('勾选了开盘价和收盘价')
def select_open_and_close_prices():
    modelQt.getQuick("openButton").click()
    modelQt.getQuick("closeButton").click()


@then('相应的行情图表应该根据选中的时间范围和图例更新')
def check_stock_chart(request):

    # 截图并添加到测试报告中
    stockChart = modelQt.getQuick("stockView").takeScreenshot()
    request.attach(stockChart, "image/png")


@then('回到股票列表')
def return_to_stock_list():
    modelQt.getQuick("arrow").click()
