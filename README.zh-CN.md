[English](./README.md) | 简体中文

# CukeTest 样例项目

CukeTest是一款功能强大的自动化测试工具，它可以帮助你编写和运行行为驱动开发（BDD）风格的测试用例，并且支持多种编程语言和测试框架，让你可以根据自己的喜好和项目需求选择合适的技术栈。

在这个仓库中，我们收集了一些CukeTest的样例项目，用来演示CukeTest的功能和用法，它包含了多个不同平台和类型的应用的自动化测试脚本。通过查看和运行这些脚本，你可以了解CukeTest如何实现桌面、Web、移动、API等应用的自动化测试，以及如何使用Javascript或Python语言编写测试用例。

## 项目内容

在项目目录中，可以选择项目脚本语言，JavaScript 或 Python。二级目录中还列出了不同的应用类型。你可以根据你感兴趣的应用类型选择一个项目来运行。

例如，如果你想要测试Web应用，你可以选择 “[Orders](javascript-zh/web/orders)” 项目；如果你想要测试Qt应用，你可以选择 “[Qt5 Dialogs](javascript-zh/qt/qt-dialog)” 项目；如果你想要测试远程自动化功能，你可以选择 “[Windows控件远程自动化](javascript-zh/remote/remote_windows_controls)” 项目等。

每个样例项目中都有一个或多个 `.feature` 文件，这些文件是用自然语言编写的测试脚本。 `.js` 文件和 `.py` 文件是项目中的实现代码，定义了 `.feature` 文件中使用的步骤函数以及其他辅助函数。

下面的表格列出了这个项目中收集的样例。

|       分类       | 样例名称                                                                  | 说明                                                                |
|:----------------:| ------------------------------------------------------------------------- | ------------------------------------------------------------------- |
|     **通用**     | [Math](javascript-zh/basic/math)                                          | Cucumber的简单数学样例                                              |
|   **Windows**    | [Windows Controls](javascript-zh/windows_controls)                        | 自动化Windows控件样例（.NET WPF)                                    |
|                  | [文件浏览器遍历](javascript-zh/windows/explorer-tree)                     | 遍历Windows树形控件                                                 |
|                  | [Notepad](javascript-zh/windows/notepad-test-zh)                          | Win10上Notepad的自动化                                              |
|                  | [Win Qt List](javascript-zh/windows/win-qt-list)                          | Windows技术自动化Qt列表控件的样例                                   |
|                  | [Win Qt Table](javascript-zh/windows/win-qt-table)                        | Windows技术自动化Qt表格控件的样例                                   |
|                  | [Win Qt Tree](javascript-zh/windows/win-qt-tree)                          | Windows技术自动化Qt树状控件的样例                                   |
|   **跨平台Qt**   | [Qt List](javascript-zh/qt/qt-list)                                       | 跨平台Qt技术自动化列表控件的样例                                    |
|                  | [Qt Table](javascript-zh/qt/qt-table)                                     | 跨平台Qt技术自动化表格控件的样例                                    |
|                  | [Qt Tree](javascript-zh/qt/qt-tree)                                       | 跨平台Qt技术自动化树状控件的样例                                    |
|                  | [Qt5 Dialogs](javascript-zh/qt/qt-dialog)                                 | 跨平台Qt技术自动化各类对话框的样例，被测应用是Qt5编译的             |
|     **图像**     | [Pattern Chooser](javascript-zh/windows/pattern-chooser)                  | 图案自动化Qt样例appchooser                                          |
|                  | [游戏消消乐](javascript-zh/windows/pattern-game)                          | 自动化Qt消消乐游戏                                                  |
|     **Web**      | [Calculator](javascript-en/web/calculator)                                | Web sample. Web Calculator                                          |
|                  | [Orders](javascript-zh/web/orders)                                        | Web自动化，用CukeTest自带的简单ERP系统为被测应用进行的Web自动化测试 |
|                  | [Shopping](javascript-zh/web/shopping)                                    | Web自动化，Web购物网站的简单样例                                    | 
|                  | [Shopping-Cart](javascript-zh/web/shopping-cart)                          | Web购物网站的简单样例，演示如何用内置的Web自动化库                  |
| **Selenium Web** | [Shopping-Cart (Selenium)](javascript-en/web/shopping-cart-selenium)      | Selenium sample. Web Shopping Cart demo                             |
|   **Electron**   | [CukeTest_Electron](javascript-zh/windows/cuketest_electron)              | Electron自动化演示：CukeTest自动化CukeTest自己                      |
|     **Java**     | [租车](javascript-zh/java-samples/car-rental)                             | Java租车应用的自动化                                                |
|     **API**      | [API Server](javascript-zh/api_service)                                   | RESTFul API的样例                                                   |
|                  | [Tcp Echo](javascript-zh/tcp-protocol)                                    | 演示TCP/IP协议的发送与接收                                          |
|    **Mobile**    | [Android自动化](javascript-zh/mobile/appium-android)                      | 结合appium实现Android应用的自动化测试                               |
|  **远程自动化**  | [Qt应用Validators的远程自动化](javascript-zh/remote/remote_qt_validators) | 跨平台Qt应用Validators远程自动化测试                                |
|                  | [Windows控件远程自动化](javascript-zh/remote/remote_windows_controls)     | 远程自动化Windows控件样例                                         |

## 克隆或下载项目到本地

我们可以使用git命令来克隆项目到本地，也可以直接从GitHub网页上下载项目的压缩包。

在终端中输入以下命令：
```bash
git clone https://github.com/cuketest/demos
```

## 运行样例项目

为了演示如何运行样例项目，我们以 [Orders](javascript-zh/web/orders) 为例。

### 安装 CukeTest

首先，你需要先安装CukeTest的桌面应用程序，你可以从官网（https://www.cuketest.com/） 下载最新版本。

### 打开项目
安装完成后，你可以启动CukeTest，在顶部菜单栏中点击 **文件** - **打开项目**，在弹出对话框中选择要打开的项目文件夹：`demos/javascript-zh/web/orders`，选好后，CukeTest会自动打开该项目。

### 运行项目

在左侧导航栏中找到并单击“features”文件夹下的 `feature1.feature` 文件。这是一个用Gherkin语法编写的BDD测试剧本文件，描述了一些对ERP系统进行订单管理操作的场景和步骤。

随后，点击CukeTest顶部的“运行项目”按钮（或者按 Ctrl+R 键），就可以开始运行该项目。在运行过程中，你会看到一个浏览器窗口被打开，并按照脚本中定义的步骤执行操作。同时，在输出面板中会显示运行日志和结果。

![image](https://www.cuketest.com/zh-cn/quick_start/assets/samples_run.png)

### 查看测试报告

当所有场景都运行完毕后，会自动打开“CukeTest报告”窗口，可以查看详细的执行报告，包括每个场景和步骤的执行结果、耗时、错误信息等。

你可以点击右侧结果报告区域上方的按钮来切换不同格式的报告，并保存到本地或者分享给他人。

## 帮助
通过使用CukeTest提供的样例项目，你可以快速地掌握BDD的基本概念和方法，也可以根据自己的需求修改和扩展样例项目。

如果你想了解更多关于CukeTest的功能和使用方法，请访问官网（https://www.cuketest.com/） 或者查看帮助文档（https://docs.cuketest.com/） 。
