# language: zh-CN
功能: QtList自动化
针对Qt的ListView组件开发的列表窗口进行操作和自动化测试。

  场景: 操作目标选项
    假如单击目标项"."
    假如选中目标项".."

  场景: 滚动列表
    假如使用列表方法进行滚动
    
  场景: 搜索后选中目标
    当在搜索框中输入路径"C:/Program Files"
    那么判断搜索结果中是否存在目标项"WindowsPowerShell"