
# Node.js Cucumber 测试自动化示例

此代码库包含演示如何使用Node.js进行测试自动化的示例。 
这些示例使用Cucumber.js进行各种测试自动化，包括Windows应用程序，Web UI，API，移动设备等。

这些样例使用Cucumber.js 5.x. 建议使用[CukeTest](http://cuketest.com)应用程序打开并运行它们，
这可以提高你的工作效率。它有内置的Cucumber.js，这意味着你只需要安装实际的自动化的npm包。

## 使用样例

要获取示例代码，请克隆存储库，或将其作为zip文件下载并在本地提取。

要运行任何示例，例如“shopping”： 

1.首先安装npm软件包，转到“shopping”文件夹的命令提示符并从命令行运行以下命令：

   ```
   npm install 
   ```

2.在CukeTest中打开“shopping”文件夹，然后单击“运行”。

> **注意：** 带有“-zh”的文件夹末尾是带有中文`feature`文件的样例。

## 按类别分类
可以使用以下类别：
* **win-samples**：演示如何进行Windows应用程序自动化的示例 
* **web-samples**：Web UI测试样例
* **bdd-samples**：演示Cucumber BDD行为驱动自动化的样例
* **qt-samples**：演示如何自动化使用Qt开发的应用（以Windows和Linux平台为例）
* **api-samples**：包含API测试样例
* **java-samples**: 演示如何进行JAVA开发的桌面应用自动化示例
开发(BDD)测试自动化框架。[CukeTest](http://cuketest.com)和[LeanRunner](http://www.leanpro.cn/leanrunner)


### Windows示例

* [记事本自动化](win-samples/notepad-test-zh)：针对记事本应用进行自动化操作，包括编辑和`txt`文件操作。  
* [微信桌面版自动化](win-samples/auto-desktop-wechat-zh)：  
* [Windows Mail自动化](win-samples/win-web-mail-zh)  
* [自动备份到百度云盘](win-samples/auto-backup-zh)  
* [Windows 10日历](win-samples/Win10Calendar)  

### Web示例
* [Web计算器](web-samples/calculator)  
* [购物页面](web-samples/shopping)  
* [操作购物车](web-samples/shopping-cart)  
* [百度搜索](web-samples/baidu-search-zh)  

### BDD样例
* [数学](bdd-samples/math)  
* [计算器](bdd-samples/calc-zh)  

### API样例
* [简单服务](api-samples/Package)  
* [Github API](api-samples/github-service-zh)  

### Qt样例
#### Windows
* [Qt列表组件](qt-samples/Windows/qt-list)
* [Qt树组件](qt-samples/Windows/qt-tree)
* [Qt表格组件](qt-samples/Windows/qt-table-win10)  
> 所有的Windows Qt样例在Qt 4.8及以上、Windows 7及以上的环境中都可以顺利运行，除了**Qt表格组件**：由于Windows 7的系统不支持单元格这一组件，因此表现与Windows 7以上的系统有所不同，如果你需要在Windows 7上运行。如果你需要Windows 7上的表格自动化样例，点击[Qt表格组件_Windows 7版本](qt-samples/Windows/qt-table-win7)。  


## 其它信息
* 要下载CukeTest，请访问[cuketest.com](http://cuketest.com)，CukeTest支持Windows、Mac、Linux，请下载对应的版本。
* 您可以在线阅读[CukeTest文档](http://cuketest.com/zh-cn)。
* 转到[cucumber.js](https://github.com/cucumber/cucumber-js)获取cucumber.js文档。

## 贡献
欢迎您通过发送给我们提供更多样例。发送pull request或新建问题来描述您的样例。
一旦我们确认它有效并将其用于教程目的，我们就会将它们添加到样例代码库中。 


