﻿# language: zh-CN
功能: 跨平台Qt应用自动化——输入对话框
输入对话框是由Qt的QInputDialog控件类实现的，在各种操作系统或CPU架构上都呈现同样的结构（但是样式风格有出入），因此可以很轻松的实现跨平台自动化。

  场景: 验证整型数值对话框
    假如打开数值对话框
    当修改数值框的值为10

  场景: 验证下拉框选择对话框
    假如打开下拉对话框
    当修改下拉框的值为"Fall"

  场景: 验证多行文本输入对话框
    假如打开文本对话框
    当修改文本框的内容为如下
      """
      多行文本
              含缩进和换行
      """