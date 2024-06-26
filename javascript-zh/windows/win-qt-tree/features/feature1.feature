# language: zh-CN
功能: QtTree自动化
使用Windows自动化技术对基于Qt框架开发的应用TreeView控件进行自动化。通过这个项目，我们可以学习到对Windows树控件的操作，包括获取树节点控件，展开树节点并滚动到可视区域。

  场景: 操作树节点对象（需要识别模型）
    假如点击模型中的树节点"C:"
    假如展开和折叠模型中的树节点"C:"

  场景: 操作树对象（不需要识别模型）
    假如点击树中的'["C:", "Windows", "System32"]'
    假如折叠与展开树中的'["C:", "Windows", "System32"]'

  场景: 访问目标路径
    假如访问并选中".\step_definitions\definitions1.js"文件
    那么"definitions1.js"节点选中