# language: zh-CN
功能: ERP订单自动录入
从excel表中读取订单数据并自动录入，将执行结果导出到excel

  场景: 进入订单管理平台
    假如打开网址"DemoErp"样例
    那么输入用户名"admin"，密码"admin"，登录账号导航到指定页面

  场景大纲: 订单录入
    那么点击“新建”按钮，读取excel文件"./support/order.xlsx"，根据"<orderNo>"将订单数据录入到系统
    同时 检查填写结果是否为"<expected>"
    例子: 
      #data_source: support/data.csv

  场景: 验证订单录入结果
    那么读取页面中的全部订单，导出为"../reports/orderList.xlsx"
    同时验证录入结果与导入的订单"support/data.csv"信息一致

  场景大纲: 删除订单
    假如删除录入"<expected>"的订单"<orderNo>"
    那么验证订单"<orderNo>"是否删除成功
    例子: 
      #data_source: support/data.csv