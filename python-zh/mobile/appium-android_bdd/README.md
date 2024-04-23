# Appium Python 示例测试项目

## 项目概述

本项目展示了如何使用 Appium 和 pytest-bdd 对 Android 应用进行自动化测试。测试用例集中在使用 API Demos 应用进行的一系列界面交互操作。

## 获取测试应用

本测试项目使用 API Demos 作为测试应用，这是一个展示 Android API 功能的演示应用。您可以从以下链接下载最新的 APK 文件：
[API Demos APK](https://github.com/appium-boneyard/sample-code/blob/master/sample-code/apps/ApiDemos/bin/ApiDemos-debug.apk)

## 环境搭建

要运行这些测试，您需要准备如下环境：

- Appium Server
- Android SDK 和模拟器或真实设备
- Appium Python Client

### 安装依赖

首先，确保您的环境已就绪。然后安装必要的 Python 包：

```bash
pip install appium-python-client
```

### 运行测试
确保所有配置正确无误后，可以通过点击`运行项目`按钮运行测试：

### 报告和日志
测试执行完毕后，您可以在指定的目录（本项目中为 `reports/`）查看截图和日志。