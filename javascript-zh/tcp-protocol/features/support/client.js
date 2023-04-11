/* 引入net模块 */
const net = require("net");
const {TCP_PORT, TCP_IP} = require('./config')
/* 创建TCP客户端 */
class TCPClient {
    constructor(ip, port) {
        this.client = net.Socket();
        this.port = port? port: TCP_PORT;
        this.ip = ip? ip: TCP_IP;
        this.messege = [];
    }

    async send(msg) {
        console.log(`Send data<${typeof msg}>: ${msg}`);
        msg += ''; // 由于服务器默认接收字符串，这里将要发送的数据转换为字符串

        /* 设置连接的服务器 */
        return new Promise((resolve, reject) => {
            let blocks = [];
            this.client.connect(this.port, this.ip, ()=>{
                /* 向服务器发送数据 */
                this.client.end(msg);
            });
            this.client.on('data', (data) => {
                /* 服务器响应的数据 */
                blocks.push(data);
            });
            this.client.on('end', (err) => {
                if (err) return reject(err);
                
                /* 将响应数据拼接并转换为字符串 */
                this.messege = Buffer.concat(blocks).toString();
                /* resolve用于异步的返回值，因此在这里可以对响应的内容进行处理，这里不进行处理直接返回 */
                resolve(this.messege);
            });
            this.client.on("error", function (error) {
                reject(error);
            });
        })
        
    }
}
module.exports = TCPClient;