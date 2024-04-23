# language: zh-CN
功能: QML计算器应用测试
使用QML开发的计算器calculator-qml.exe可以进行基本的加减乘除运算，本项目使用该应用进行Qt Quick应用的测试。

  场景大纲: 验证计算器的运算功能
    假如开始计算
    当设置操作符"<param1>"
    当点击操作"<param2>"
    当设置被操作符"<param3>"
    那么结果应该等于"<param4>"
    例子: 
      | param1 | param2 | param3 | param4 |
      | 1      | +      | 2      | 3      |
      | 3      | +      | 4      | 7      |
      | 2      | ×      | 3      | 6      |