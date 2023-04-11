# language: zh-CN

功能: 接口自动化测试
这是一个Cucumber 5.x 接口自动化测试的样例脚本，用到两个外部依赖库来启动一个API Mock服务，因此需要打开命令行窗口，运行以下命令来安装依赖：
    npm --registry https://registry.npm.taobao.org install  

Mock服务会在运行时自动启动，并在项目结束后自动关闭，修改后的数据可以在项目中的data.json文件中查看。
* 为了便于演示，在每次运行时都会使用原文件data_origin.json覆盖修改后的data.json，详见feature/support/hook.js
  @get
  场景大纲: Get 方法样例
    而且发送Get请求 "<URL>" 服务器应该返回数据 '<expectval>'
    例子: 
      | URL                           | expectval                                                                                                            |
      | http://localhost:3000/users/1 | {   "id": 1,   "name": "therebelrobot",   "location": "USA" }                                                        |
      | http://localhost:3000/users/2 | {   "id": 2,   "name": "visiting-user",   "location": "UK" }                                                         |
      | http://localhost:3000/posts/1 | {   "id": 1,   "title": "json-mock",   "body": "The internet is cool!",   "author": "therebelrobot",   "userId": 1 } |

  @post
  场景大纲: Post 请求样例
    而且发送Post请求 "<URL>" 请求数据为 '<data>' 服务器应该返回结果 '<expectval>'
    例子: 
      | URL                         | data                                                | expectval                                           |
      | http://localhost:3000/posts | { "id": 3, "name": "cuketest", "location": "CHINA"} | { "id": 3, "name": "cuketest", "location": "CHINA"} |

  @put
  场景大纲: Put 请求
    而且发送Put请求 "<URL>" 请求数据为 '<data>' 服务器应该返回结果'<expectval>'
    例子: 
      | URL                           | data                                                   | expectval                                              |
      | http://localhost:3000/users/3 | {   "id": 3,   "name": "jack",   "location": "china" } | {   "id": 3,   "name": "jack",   "location": "china" } |

  @patch
  场景大纲: Patch 请求
    而且发送Patch请求"<URL>" 请求数据为 '<data>' 服务器应该返回结果 '<expectval>'
    例子: 
      | URL                           | data            | expectval                                              |
      | http://localhost:3000/users/4 | {"name":"zack"} | {   "id": 4,   "name": "zack",   "location": "china" } |

  @delete
  场景大纲: Delete请求
    而且发送delete请求到"<URL>" 应该得到结果 '<expectval>'
    例子: 
      | URL                              | expectval |
      | http://localhost:3000/comments/2 | {}        |