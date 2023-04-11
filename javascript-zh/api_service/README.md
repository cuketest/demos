# 一个简单的接口测试项目
在这个项目中，借助npm库——`json-server`搭建一个简单的数据服务后台，用于响应get、post等API的请求，从而完成数据的增删改查（CRUD）。可以在帮助中搜索**演练：创建并运行API自动化测试项目**来查看详细的步骤教程。

在这个项目中，你会学习到以下内容：
* 安装npm库
* 创建和使用场景大纲和示例表
* 使用内置`got`库进行API测试


## 项目介绍
项目中有五种HTTP请求类型：`got`、`post`、`put`、`patch`和`delete`。每一种请求类型都由一个场景大纲来管理测试，从而可以通过添加数据行来快速增加测试用例，这些可以在`feature.feature`文件中看到。

### 运行前准备
由于项目有第三方依赖库需要联网安装，有如下两个库：
1. `json-server`包：用于启动数据服务；
2. `killport`包：用于停止目标端口的服务；

而用于发起HTTP请求的`got`库由CukeTest内置了，因此不需要重新安装，当然如果希望使用其它的库，比如`axios`也可以一并安装，但脚本需要改动，这里就不展开了。

#### 库简介
##### `json-server`库
顾名思义这个库通过一个`json`文件启动一个服务（在本项目中基于的是`data.json`文件），该服务在接收到请求时会根据请求类型对该`json`文件进行读写。因此请求的结果不仅可以在响应中观察，也可以直接打开`data.json`文件进行查看。为了保证每次启动服务的文件状态一致，还准备了`data_origin.json`文件保存原始数据，可以用于对比观察`data.json`文件的修改。

##### `killport`库
用于停止（kill）占用目标端口的进程。

#### `got`库
用于发起HTTP请求的库，也是CukeTest内置的一个库，当然也可以不使用内置的库，而引入其它HTTP库如`axios`。

### 剧本说明
本次项目中的剧本有一个特点，就是大量使用了**场景大纲**用于管理场景，这对于API测试这类涉及大量用例和结果（响应）检验的测试场景非常的高效。

剧本中分为了五个场景大纲，如果是get、delete这类不需要带请求体的，只需要请求URL和检验结果两列数据，如果post、put、patch这类需要携带请求体数据的，则另外需要一列`data`用于输入请求体参数。

#### 什么是场景大纲？
场景大纲是一种特殊的场景，它使用表（称作示例表）来管理测试数据，表中的每一行数据都会在运行时渲染到对应的步骤中，生成多个场景。比如下面的场景大纲：
```gherkin
场景大纲: Get 方法样例
    而且发送Get请求 "<URL>" 服务器应该返回数据 '<expectval>'
    例子: 
        | URL                           | expectval                                              |
        | /users/1 | {   "id": 1,   "name": "therebelrobot",   "location": "USA" }|
        | /users/2 | {   "id": 2,   "name": "visiting-user",   "location": "UK" } |
        | /posts/1 | {   "id": 1,   "title": "json-mock",   "body": "The internet is cool!",   "author": "therebelrobot",   "userId": 1 } |
```
等效于使用多个场景：
```gherkin
场景： Get方法样例1
    而且发送Get请求 "/users/1" 服务器应该返回数据 '{"id": 1,"name": "therebelrobot","location": "USA" }'

场景： Get方法样例2
    而且发送Get请求 "/users/2" 服务器应该返回数据 '{"id": 2,"name": "visiting-user","location": "UK" }'

场景： Get方法样例3
    而且发送Get请求 "/posts/1" 服务器应该返回数据 '{"id": 1,"title": "json-mock","body": "The internet is cool!","author": "therebelrobot","userId": 1 }'
```

可以看出来，在API测试里使用场景大纲可以减少很多工作量。

### 脚本说明
本次脚本所有的步骤实现都类似，遵循以下规律：
1. 构建请求体，如果不需要请求体则使用默认的`jsoFormat`;
2. 向目标URL发送请求，并处理响应的结果；
3. 检查结果是否符合预期。  


#### 钩子函数文件
在项目的`/support`目录中，有个`hook.js`脚本文件，里面包含了钩子函数`hooks`，目的是在项目或场景运行前后执行准备、收集或清理等操作。这些脚本不会表现在剧本中，因此这里放的通常不会是与业务流程相关的脚本，而是一些不需要业务人员关心细节的脚本。更多关于钩子函数的内容点击[了解更多](http://cuketest.com/zh-cn/cucumber/support_files/hooks.html)。

本次项目的钩子函数中进行了以下操作：
**项目执行前**：  
1. 用原始数据文件`data_origin.json`文件覆盖`data.json`文件，从而保持每次执行采用的是相同的数据。
2. 启动数据服务，启动后数据服务会开始监听`3000`端口的请求。

**项目执行后**：  
1. 停止`3000`端口正在运行的数据服务。
2. 短暂延时，等待命令行窗口关闭。