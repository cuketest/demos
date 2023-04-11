Feature: Qt ListView自动化
  使用跨平台Qt技术对Qt中的ListView控件进行自动化，可在各个平台（如Windows、Linux）上执行。
  用于自动化的应用是FetchMore应用

  Scenario: 选择目标位置的列表选项
    When 搜索CukeTest安装路径下的bin
    Then 点击第13个选项

  Scenario: 选择列表选项
    When 搜索CukeTest安装路径下的.
    Then 点击选项version

  Scenario: 操作列表选项对象
    Given 操作对象为列表中的第11个选项
    Then 跳转到目标选项位置
    Then 点击目标选项