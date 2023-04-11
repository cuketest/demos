Feature: QtTree自动化
针对Qt中的TreeView控件进行自动化

  Scenario: 操作树节点对象（需要识别模型）
    Given 点击模型中的树节点Windows  (C:)
    Given 展开和折叠模型中的树节点Windows  (C:)

  Scenario: 操作树对象（不需要识别模型）
    Given 点击树中的["Windows  (C:)", "Windows", "System32"]
    Given 折叠与展开树中的["Windows  (C:)", "Windows", "System32"]

  Scenario: 访问目标路径
    Given 访问并选中.\\step_defs\\test_feature1.py文件
    Then test_feature1.py节点选中