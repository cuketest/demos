# language: zh-CN
功能: QtList自动化
针对Qt的ListView组件开发的列表窗口进行操作和自动化测试。

  场景: 操作目标选项
    假如单击目标项"."
    当双击目标项".."
    那么右键目标项"."并选择操作

  场景: 滚动列表
    假如使用模拟按键进行滚动和翻页
    当使用滚动条按钮进行翻页
    那么使用drag与drop方法进行拖拽或滑屏操作
    那么使用vScroll和hScroll进行滚动（Qt暂不支持）

  场景: 搜索后选中目标
    当在搜索框中输入路径"C:/Program Files"
    那么判断搜索结果中是否存在目标项"WindowsPowerShell"