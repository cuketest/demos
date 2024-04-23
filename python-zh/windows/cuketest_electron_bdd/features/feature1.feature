# language: zh-CN
功能: 验证工具栏功能
验证以下功能:  
  新建剧本/脚本
  新建项目
  打开
  打开项目
  保存
  运行项目
  运行剧本/脚本

  场景: 新建剧本/脚本
    假如点击新建剧本下拉按钮中的feature
    当点击保存按钮
    那么保存为newDropdownFeature
    那么验证newDropdownFeature.feature文件存在
    那么点击新建剧本下拉按钮中的javascript
    那么点击保存按钮
    那么保存为newDropdownScript
    那么验证newDropdownScript.js文件存在

  场景: 运行项目
    假如打开项目public\math
    当点击运行项目按钮
    那么等待运行结束
    那么输出栏中出现运行结果包含下面内容
      """
      运行项目
      """

  场景: 运行剧本/脚本
    假如打开项目public\math
    当打开文件public\math\features\simple math.feature
    那么点击运行剧本按钮
    那么等待运行结束
    那么输出栏中出现运行结果包含下面内容
      """
      scenario
      """
    那么打开项目public\math
    那么打开文件public\math\test.js
    那么点击运行脚本按钮
    那么等待运行结束
    那么输出栏中出现运行结果包含下面内容
      """
      运行脚本
      """
  # Scenario: 打开模型管理器
  #   Given 点击模型管理器按钮打开新窗口
  #   When 截图模型管理器
  #   Then 关闭模型管理器