# 一个简单的TCP协议通信样例
用于演示使用CukeTest进行TCP Socket通信的样例，样例除了步骤脚本外，还包含了建立TCP服务端和客户端的脚本（`server.js`和`client.js`文件）。通过客户端向服务端发送消息，接着服务端将接收到的消息作为响应返回。由于服务端和客户端没有对数据包进行截断和拼接的处理，因此建议不要传输过多的内容，控制在**64KB**以内最好。  

你可以学到：
* TCP Socket通信方式

## 脚本介绍
### TCP客户端`client.js`
所有向TCP服务端发送的消息都需要通过TCP客户端发送，用法如下：
```js
const TCPClient = require('/path/to/server.js');
(async function(){
    let tcp = new TCPClient();
    let response = await tcp.send(messageToSend); 
})()
```

### TCP服务端`server.js`
用于创建TCP服务端，用于响应客户端发送的消息。在运行项目时，会在步骤开始前（`BeforeAll` hook）启动服务端，项目结束后会随着项目停止。服务端所有的操作都会写入到日志文件`tcp.log`中。

### 配置文件`config.js`
用于管理TCP通信的配置：
* `TCP_IP`即TCP服务端启动的地址，默认启动方式是在本机上，不需要修改；
* `TCP_PORT`用于TCP通信的端口，在端口不冲突的前提下可以自由修改。

## 项目介绍
这个项目分别发送字符串、数字、文件到TCP服务器中， 并检验响应是否符合预期。由于示例中没有直接将接收到的内容响应回来，因此只需要判断发送和响应是否相等。由于本质上通信传输的都是字符串（在Node.js中称作`ByteArray`），因此传输的处理上也比较简单，在不同场景中进行不同数据类型的处理：
* 字符串：不需要处理；
* 数字：转换为字符串（在`client.js`中处理）；
* 文件名/路径：读取文件内容并传输。