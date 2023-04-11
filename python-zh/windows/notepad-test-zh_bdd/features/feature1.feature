Feature: 自动化记事本应用
以Windows 10记事本为例，讲解在自动化测试Windows桌面应用的时候，如何解决菜单下拉问题。
比如: 记事本的【格式】--【字体】，【文件】--【保存】

  Scenario: 编辑内容并保存
    Given 打开Windows记事本应用
    When 在记事本中输入文本hello world
    And 点击【文件】--【保存】
    And 在文件对话框中保存为项目路径中的helloworld.txt
    Then 文件应该保存成功

  Scenario: 更改记事本字体
    When 点击【格式】--【字体】
    And 从【字体】下拉框中选择Arial
    And 从【字形】下拉框中选择粗体
    And 从【大小】下拉框中选择一号
    And 单击【确定】按钮以关闭【字体...】对话框
    Then 字体应该设置成功