English | [简体中文](./README.zh-CN.md)

# CukeTest Sample Projects

CukeTest is a powerful automation testing tool that helps you write and run Behavior Driven Development (BDD) style test cases and supports multiple programming languages and testing frameworks, allowing you to choose the right technology stack according to your preferences and project needs.

In this repository, we have collected some sample projects to demonstrate the functionality and usage of CukeTest, which contains several automated test scripts for different platforms and types of applications. By viewing and running these scripts, you can learn how CukeTest automates testing for desktop, web, mobile, API, and other applications, as well as how to write test cases using Javascript or Python languages.

Translated with www.DeepL.com/Translator (free version)

## Contents

In the project directory, you can select the project script language, JavaScript or Python. the secondary directory also lists the different application types. You can select a project to run based on the type of application you are interested in.

For example, if you want to test web applications, you can choose the "[Orders](javascript-zh/web/orders)" project; if you want to test Qt applications, you can choose the "[Qt5 Dialogs](javascript-zh/qt/qt-dialog)" project; if you want to test remote automation features, you can If you want to test remote automation functionality, you can select the "[Windows Control Remote Automation](javascript-zh/remote/remote_windows_controls)" project, etc.

Each sample project has one or more `.feature` files, which are test scripts written in a natural language. The `.js` files and `.py` files are the implementation code in the project that defines the step functions used in the `.feature` files and other helper functions.

The following table lists the samples collected in this project.

|     Category     | Sample Name                                                                                 | Description                                                                                            |
|:----------------:| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
|    **basic**     | [Math](javascript-zh/basic/math)                                                            | Simple math sample for Cucumber                                                                        |
|   **Windows**    | [Windows Controls](javascript-zh/windows_controls)                                          | Sample automated Windows controls (.NET WPF)                                                           |
|                  | [File browser traversal](javascript-zh/windows/explorer-tree)                               | Traversing Windows tree controls                                                                       |
|                  | [Notepad](javascript-zh/windows/notepad-test-zh)                                            | Automation of Notepad on Win10                                                                         |
|                  | [Win Qt List](javascript-zh/windows/win-qt-list)                                            | Sample automation Qt list control for Windows technology                                               |
|                  | [Win Qt Table](javascript-zh/windows/win-qt-table)                                          | Sample automation Qt table control for Windows technology                                              |
|                  | [Win Qt Tree](javascript-zh/windows/win-qt-tree)                                            | Sample Windows Technical Automation Qt Tree Control                                                    |
|      **Qt**      | [Qt List](javascript-zh/qt/qt-list)                                                         | Sample cross-platform Qt automation list control                                                       |
|                  | [Qt Table](javascript-zh/qt/qt-table)                                                       | Sample cross-platform Qt automation table control                                                      |
|                  | [Qt Tree](javascript-zh/qt/qt-tree)                                                         | Sample cross-platform Qt automation tree control                                                       |
|                  | [Qt5 Dialogs](javascript-zh/qt/qt-dialog)                                                   | Sample cross-platform Qt automation of various dialogs, compiled for Qt5                               |
|    **Image**     | [Pattern Chooser](javascript-zh/windows/pattern-chooser)                                    | Pattern automation Qt sample appchooser                                                                |
|                  | [Same Game](javascript-zh/windows/pattern-game)                                             | Automated Qt same game                                                                                 |
|     **Web**      | [Calculator](javascript-en/web/calculator)                                                  | Web sample. Web Calculator                                                                             |
|                  | [Orders](javascript-zh/web/orders)                                                          | Web automation test for the application under test with the simple ERP system that comes with CukeTest |
|                  | [Shopping](javascript-zh/web/shopping)                                                      | Web Automation, a simple example of a web shopping site                                                |
|                  | [Shopping-Cart](javascript-zh/web/shopping-cart)                                            | A simple example of a Web shopping site, demonstrating how to use the built-in Web automation library. |
| **Selenium Web** | [Shopping-Cart (Selenium)](javascript-en/web/shopping-cart-selenium)                        | Selenium sample. Web Shopping Cart demo                                                                |
|   **Electron**   | [CukeTest_Electron](javascript-zh/windows/cuketest_electron)                                | Electron automation demo: CukeTest automation CukeTest itself                                          |
|     **Java**     | [Car Rental](javascript-zh/java-samples/car-rental)                                         | Java car rental application automation                                                                 |
|     **API**      | [API Server](javascript-zh/api_service)                                                     | Sample RESTFul API                                                                                     |
|                  | [Tcp Echo](javascript-zh/tcp-protocol)                                                      | Demonstration of TCP/IP protocol sending and receiving                                                 |
|    **Mobile**    | [Android Automation](javascript-zh/mobile/appium-android)                                   | Combining appium to automate testing of Android applications                                           |
|    **Remote**    | [Remote automation of Qt application Validators](javascript-zh/remote/remote_qt_validators) | Remote automation of Qt application Validators                                                         |
|                  | [Remote Automation of Windows Controls](javascript-zh/remote/remote_windows_controls)       | Remote Automation of Windows Controls Sample                                                           |

## Clone or download

We can use the git command to clone the project locally, or we can download the zip archive of the project directly from the GitHub web page.

Type the following command in the terminal:
```bash
git clone https://github.com/cuketest/demos
```

## Run the sample project

To demonstrate how to run the sample project, let's take [Orders](javascript-zh/web/orders) as an example.

### Installing CukeTest

First, you need to install the CukeTest desktop application, you can download the latest version from the official website (https://www.cuketest.com/).

### Open Project

Once installed, you can launch CukeTest, click **File** - **Open Project** in the top menu bar, and select the project folder you want to open in the pop-up dialog: `demos/javascript-zh/web/orders`, and once selected, CukeTest will automatically open the project.

### Running Project

Find and click on the `feature1.feature` file in the "features" folder in the left navigation bar. This is a BDD test script file written in Gherkin syntax, describing some scenarios and steps to perform order management operations on the ERP system.

Then, click the "Run Project" button at the top of CukeTest (or press Ctrl+R) to start running the project. During the run, you will see a browser window open and follow the steps defined in the script. At the same time, the run log and results are displayed in the output panel.

![image](https://www.cuketest.com/zh-cn/quick_start/assets/samples_run.png)

### View Test Report

When all scenes are run, the "CukeTest Report" window will open automatically, and you can view a detailed execution report, including the results of each scene and step, time spent, error messages, etc.

You can click the button on the right side above the result report area to switch between different report formats and save them locally or share them with others.

## Support
By using the sample projects provided by CukeTest, you can quickly master the basic concepts and methods of BDD, and also modify and extend the sample projects to suit your needs.

If you want to learn more about the features and usage of CukeTest, please visit the official website (https://www.cuketest.com/) or check the help documentation (https://docs.cuketest.com/).
