# Windows应用自动化样例（基于PyTest测试框架）

## 介绍
该样例基于PyTest测试框架，同时也可以直接在CukeTest中运行。

样例会打开CukeTest提供的SimpleStyle样例应用，并执行桌面测试任务，完成以下几种控件的测试：
1. 窗口控件Window
2. 按钮控件Button
3. 复选框控件CheckBox
4. 输入框控件Edit

测试中还会对不同操作的结果进行**断言**（检查点），如：
```py
name = "Default"
# 获取button的name属性值应该为"{name}"
nameval = model.getButton("Default").property('name')
assert nameval==name
```

也会将一些**数据/图片上传**到报告中加以呈现，如：
```py
def test_button(extra):
    with sync_auto() as auto:        
        WinAuto = auto.winAuto
        model = WinAuto.loadModel('model1.tmodel')
        
        # ...

        # 获取button控件所有属性并上传报告
        control = model.getButton("Default")
        attr = getAllCommonAttr(control)
        image = model.getButton("Normal").takeScreenshot()
        print("直接print序列化后的对象信息：%s" %dumps(attr))
        extra.append(extras.text("序列化后的对象信息: %s" %dumps(attr)))
        extra.append(extras.json(attr))
        extra.append(extras.image(image))
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
