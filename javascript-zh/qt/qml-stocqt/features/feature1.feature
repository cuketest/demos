# language: zh-CN
功能: 股票市场应用UI显示验证
股票市场应用提供了股票信息的展示和相关操作。本功能用于验证在股票市场应用中的图表显示以及视图切换功能的正确性。

  场景: 验证股票图表显示及视图切换功能
    假设在股票列表中选择 AAPL
    那么应该看到股票代码、公司名称、当前价格和价格变动
    当切换行情视图为近六月
    并且勾选了开盘价和收盘价
    那么相应的行情图表应该根据选中的时间范围和图例更新
    那么回到股票列表