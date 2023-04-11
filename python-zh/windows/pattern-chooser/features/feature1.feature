Feature: 图像自动化
借助Qt应用appchooser进行图像自动化的演示

  Scenario: 针对appchooser样例的自动化
    When 循环点击四个图案2次并统计识别时间

  Scenario: 测试图像自动化的API
    Then 验证相机此时不居中
    Then 点击相机
    Then 验证相机此时居中

  @only-windows
  Scenario: 测试Windows下的虚拟控件API
    When 点击级联虚拟控件字典虚拟控件（Win）
    Then 验证相机此时不居中
    Then 通过Windows控件虚拟化点击左上角
    Then 验证相机此时居中

  Scenario: 测试Qt下的虚拟控件API
    When 点击级联虚拟控件相机虚拟控件（Qt）
    Then 验证相机此时居中
    Then 通过Qt控件虚拟化点击右上角
    Then 验证相机此时不居中