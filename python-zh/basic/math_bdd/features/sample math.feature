Feature: 数学计算
  加法测试，剧本用法演示样例
  Scenario: 简单数学计算
    Given 初始值设为1
    When 现在再加1
    Then 结果为2

  Scenario Outline: 混合场景
    Given 初始值设为<var>
    When 现在再加<increment>
    Then 结果为<result>
    Examples:
      | var | increment | result |
      | 100 | 5         | 105    |
      | 101 | 5         | 106    |
      | 200 | 6         | 206    |
