# language: zh-CN
功能: 自动化记事本应用
以记事本为例，讲解在自动化测试Windows桌面应用的时候，如何解决菜单下拉问题。
比如: 记事本的【格式】--【字体】，【文件】--【保存】

  场景: 编辑内容并保存
    假如打开Windows记事本应用
    当在记事本中输入文本"hello world"
    并且点击【文件】--【保存】
    同时在文件对话框中保存为项目路径中的"helloworld.txt"
    那么文件应该保存成功

  场景: 更改记事本字体
    当点击【格式】--【字体】
    并且从【字体】下拉框中选择"Arial"
    并且从【字形】下拉框中选择"粗体"
    并且从【大小】下拉框中选择"一号"
    同时单击【确定】按钮以关闭【字体...】对话框
    那么字体应该设置成功