# language: zh-CN
功能: 表单提交功能验证
验证表单提交的字段显示功能

系统要求：
- 已安装Chrome 85以上版本（国产操作系统也可以使用龙芯浏览器，取消注释`definitions.js`文件的“executablePath”的选项。

  场景: 提交表单到Payment页面
    假如打开网站首页"https://cuketest.github.io/apps/shopping/"
    当点击Pay parking到表单提交页面
    当输入表单数据，点击Paying按钮
      | TICKET | CREDIT CARD       | DUE DATE | CODE |
      | 187465 | 55431234423137865 | 11/25    | 908  |
    那么在Payment 页面中能够显示出上述表单中输入的值