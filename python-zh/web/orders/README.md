# ERP系统自动化（基于PyTest-BDD）
## 项目介绍
基于CukeTest提供的ERP系统样例，进行简单的Web自动化操作。

### 使用技术
当前项目使用Python语言进行开发，使用的测试框架为[PyTest-BDD](https://pytest-bdd.readthedocs.io/en/latest/index.html)。

自动化部分使用CukeTest提供的Web自动化库`leanproWeb`；Excel文件读写部分使用的是CukeTest内置的xlsx读写库`openpyxl`。


## 开始运行
1. 启动Web样例，并复制样例地址
2. 修改`step_defs\test_erp.py`中的`goto_home()`方法中的地址为样例的实际地址
3. 点击运行项目（或在命令行使用`cuke run`运行）

## 与JS项目的差异
CukeTest同时提供了JavaScript版本的ERP系统自动化项目，这里比较一下两者的差异：
1. 剧本差异
   1. 不支持中文关键字
   2. 仅支持`Given`/`When`/`Then`三个关键字
   3. 不支持链接示例表
2. 脚本差异
   1. 不支持混用`leanproAuto`库和`leanrpoWeb`库
   2. 不支持报告附件
   3. Hooks不算作步骤（因此不会显示在报告中）；需要在`conftest.py`文件中定义