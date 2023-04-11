Feature: ERP订单自动录入
从excel表中读取订单数据并自动录入，将执行结果导出到excel

  Scenario: : 进入订单管理平台
    Given 打开网址"DemoErp"样例
    Then 输入用户名"admin"，密码"admin"，登录账号导航到指定页面

  Scenario Outline: 订单录入
    Then 点击“新建”按钮，读取excel文件"./support/order.xlsx"，根据"<orderNo>"将订单数据录入到系统
    When 检查填写结果是否为"<expected>"
    Examples: 
        | orderNo        | expected |
        |SAL20210315026|success|
        |SAL20210315027|success|
        |SAL20210315028|success|
  # Scenario: : 验证订单录入结果
  #   Then 读取页面中的全部订单，导出为"../reports/orderList.xlsx"
  #   When 验证录入结果与导入的订单"support/data.csv"信息一致
  Scenario Outline: 删除订单
    Given 删除录入"<expected>"的订单"<orderNo>"
    Then 验证订单"<orderNo>"是否删除成功
    Examples: 
        |orderNo|expected|
        |SAL20210315026|success|
        |SAL20210315027|success|
        |SAL20210315028|success|