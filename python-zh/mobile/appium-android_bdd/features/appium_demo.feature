# language: zh-CN
功能: appium demo
使用CukeTest结合pytest-bdd框架，您可以轻松构建手机端的自动化测试。
本示例兼容 Appium Python 客户端版本 2.3.0 及以上。在使用前，请确保在CukeTest命令行中执行以下命令以安装必要的依赖：Appium-Python-Client

  场景: API Demo 页面跳转
    假如点击App跳转到App页面
    当在App页面中点击Action Bar
    那么页面应该跳转到Action Bar页面,页面中应该包含"Action Bar Mechanics"