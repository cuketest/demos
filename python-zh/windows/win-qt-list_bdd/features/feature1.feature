Feature: QtList自动化
针对Qt的ListView组件开发的列表窗口进行操作和自动化测试。

  Scenario: 操作目标选项
    Given 单击目标项.
    Given 选中目标项..

  Scenario: 滚动列表
    Given 使用列表方法进行滚动

  Scenario: 搜索后选中目标
    When 在搜索框中输入路径C:/Windows
    Then 判断搜索结果中是否存在目标项notepad.exe