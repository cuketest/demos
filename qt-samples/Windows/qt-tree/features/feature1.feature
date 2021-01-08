# language: zh-CN
功能: QtTree自动化
针对Qt中的TreeView控件进行自动化

  场景: 操作树节点对象（需要识别模型）
    假如点击模型中的树节点"D:"
    假如展开和折叠模型中的树节点"D:"

  场景: 操作树对象（不需要识别模型）
    假如点击树中的'["Windows  (C:)", "Windows", "System32"]'
    假如折叠与展开树中的'["Windows  (C:)", "Windows", "System32"]'
 
  场景: 访问目标路径
    假如访问并选中".\step_definitions\definitions1.js"文件
    那么"definitions1.js"节点选中