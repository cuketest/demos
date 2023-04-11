# language: zh-CN
功能: 验证TCP协议通信功能
使用自建的TCP服务器用于通信，所有向服务器发送的消息将写入响应和服务器日志。  

发送和接收的报文记录可以在项目的tcp.log文件中看到。

  场景大纲: 发送纯文本的能力
    假如发送文本"<text>"并检验
    例子: 
      | text          |
      | 123           |
      | abc           |
      | abc123        |
      | \\.*\\'\\"~!- |
      | 中文内容          |

  场景大纲: 检验发送数字的能力
    假如发送数字<number>并检验
    例子: 
      | number |
      | 123    |
      | 0      |
      | 65535  |

  场景大纲: 检验发送文件的能力
    假如发送"<filename>"文件并检验
    例子: 
      | filename                    |
      | ./package.json              |
      | ./features/support/data.txt |