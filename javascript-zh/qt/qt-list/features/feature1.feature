# language: zh-CN
功能: Qt ListView自动化
使用跨平台Qt技术对Qt中的ListView控件进行自动化，可在各个平台（如Windows、Linux）上执行。
用于自动化的应用是FetchMore应用

  场景: 选择目标位置的列表选项
    当搜索CukeTest安装路径下的"./bin"
    那么点击第13个选项

  场景: 选择列表选项
    当搜索CukeTest安装路径下的"./"
    那么点击选项"version"

  场景: 操作列表选项对象
    假如操作对象为列表中的第11个选项
    那么跳转到目标选项位置
    那么点击目标选项