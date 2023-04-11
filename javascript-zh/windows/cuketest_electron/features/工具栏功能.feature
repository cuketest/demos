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
    * 点击"新建剧本"下拉按钮中的"feature"
    * 点击"保存"按钮
    * 保存为"newDropdownFeature"
    * 验证"newDropdownFeature.feature"文件存在
    * 点击"新建剧本"下拉按钮中的"javascript"
    * 点击"保存"按钮
    * 保存为"newDropdownScript"
    * 验证"newDropdownScript.js"文件存在

  场景: 运行项目
    * 打开项目"../public/math"
    * 点击"运行项目"按钮
    * 等待运行结束
    * 输出栏中出现运行结果包含下面内容
      """
      运行项目
      """

  场景: 运行剧本/脚本
    * 打开项目"../public/math"
    * 打开文件"../public/math/features/simple math.feature"
    * 点击"运行剧本"按钮
    * 等待运行结束
    * 输出栏中出现运行结果包含下面内容
      """
      scenario
      """
    * 打开项目"../public/math"
    * 打开文件"../public/math/test.js"
    * 点击"运行脚本"按钮
    * 等待运行结束
    * 输出栏中出现运行结果包含下面内容
      """
      运行脚本
      """

  场景: 打开模型管理器
    假如点击"模型管理器"按钮打开新窗口
    当截图模型管理器
    那么关闭模型管理器