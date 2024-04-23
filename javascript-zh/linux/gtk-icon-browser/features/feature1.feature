# language: zh-CN
功能: 自动化GTK应用Icon-Browser
使用CukeTest内置的GTK应用Icon-browser进行简单的GTK应用自动化。
（GTK是主流Linux图形界面平台使用GUI应用框架）

  场景: 简单操作
    假如打开应用
    当最大化应用窗口

  场景: 基本操作流程
    假如打开搜索栏
    当搜索名字包含"control"的图标
    * 切换图标风格
    那么验证搜索结果

  场景: 复杂操作
    假如获取列表中的所有内容
    当选中第3项并验证选中情况