# language: zh-CN
功能: QtTree自动化
使用Windows自动化技术对基于Qt框架开发的应用TreeView控件进行自动化。

  场景: 操作树节点对象（需要识别模型）
    假如点击模型中的树节点Windows  (C:)
    假如展开和折叠模型中的树节点Windows  (C:)

  场景: 操作树对象（不需要识别模型）
    假如点击树中的["C:", "Windows", "System32"]
    假如折叠与展开树中的["C:", "Windows", "System32"]

  场景: 访问目标路径
    假如访问并选中.\\step_defs\\test_feature1.py文件
    那么test_feature1.py节点选中