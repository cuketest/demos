Feature: 遍历原生Windows应用树节点
以Windows资源管理器为被测应用进行树节点的遍历

  Scenario: 遍历资源管理器
    Given 打开资源管理器
    When 遍历展开树视图
    Then 将结果附件