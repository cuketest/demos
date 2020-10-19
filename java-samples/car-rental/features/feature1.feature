# language: zh-CN
功能: Java自动化API测试
使用CarRental应用进行Java自动化API的测试与验证

  @debug
  场景: 启动并进入欢迎界面
    * 使用账户名"john"登录

  场景: 浏览汽车
    * 进入看车界面
    * 选中汽车"Toyota Prius"
    * 查看汽车信息
    * 返回首页

  @debug
  场景: 选择租赁的汽车
    * 进入租车界面
    * 选择地区"New York"
    * 选择汽车"Toyota Prius"
    * 填写个人信息并选择附加服务
    * 完成租车

  场景: 查看租车订单
    * 进入订单界面
    * 搜索与"Mark"相关的订单
    * 检查订单客户全称为"Mark Test"
    * 返回首页

  场景: 关闭应用
    * 关闭CarRental应用
    # * 通过菜单关闭CarRental应用