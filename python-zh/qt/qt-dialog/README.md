# Qt应用自动化样例（基于PyTest测试框架）

## 介绍
该样例基于PyTest测试框架，同时也可以直接在CukeTest中运行。

样例会打开CukeTest提供的Qt样例应用`standarddialogs.exe`，并执行桌面测试任务，完成以下几种对话框控件的测试：
1. 整型数值输入对话框
2. 下拉框选项输入对话框
3. 多行文本输入对话框

测试中还会对不同操作的结果进行**断言**（检查点），如：
```py

# 验证整型数值对话框
def test_qt_int_dialog(extra):
    with sync_auto() as auto:        
        # ...
        value = 10
        # ...
        labelControl = model.getButton("QInputDialog::getInt()").next("Label")
        inputValue = int(labelControl.text().replace("%", ""))
        # ...
        assert inputValue == value, "没有成功修改数值"
```

也会将**应用截图上传**到报告中加以呈现，如：
```py
def test_button(extra):
    with sync_auto() as auto:        
        # ...
        extra.append(extras.image(model.getWindow("Standard_Dialogs").takeScreenshot()))
```

也可以引入Hook来管理测试运行前后的**准备和清理工作**，如`conftest.py`文件中的：
```py
# 等效于 BeforeAll Hook，在第一个测试开始前被调用
def pytest_sessionstart(session):
    ...
# 等效于 AfterAll Hook，在所有测试结束后被调用
def pytest_sessionfinish(session):
    ...
# 等效于 Before Hook，在每个测试开始前被调用
def pytest_runtest_logstart(nodeid, location):
    ...
# 等效于 After Hook，在每个测试结束后被调用
def pytest_runtest_logfinish(nodeid, location):
    ...
```


## 运行
在主界面中点击“**运行项目**”按钮开始运行。
