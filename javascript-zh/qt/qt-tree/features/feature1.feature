# language: zh-CN
功能: QtTree自动化
使用跨平台Qt技术对Qt中的TreeView控件进行自动化，可在各个平台（如Windows、Linux）上执行。

  场景: 根据itemPath展开树树节点
    假如目标树节点的itemPath为"[0, 0]"，获取该树节点的对象
    那么将目标树节点展开到可视范围内
    那么选中目标树节点并验证
    那么应用截图

  场景: 根据文件路径展开并选中目标树节点
    假如展开到"./step_definitions/definitions1.js"文件所在树节点
    那么选中目标树节点并验证
    那么应用截图