const fs = require('fs');
const path = require('path');
const net = require('net');
const {TCP_PORT} = require('./config');
const logFile = path.join(__dirname, 'tcp.log');

let server = net.createServer(function (socket) {
    socket.on('listening', ()=> {
        appendLog("Socket is listening.");
    });
    socket.on('connection', ()=> {
        appendLog("Socket is connected.");
    });
    socket.on('error', (err)=> {
        appendLog("Socket happen error.\n" + err.stack);
    });
    
    let readSize = 0;
    let readStream = [];
    socket.on('data', (data) => {
        readStream.push(data);
        readSize = socket.bytesRead >> 10;
        appendLog(data.toString());
        // 向客户端响应的内容
        socket.write(data);
    });
    socket.on('end', (err) => {
        let message = `Receive complete. Size ${readSize ? readSize : 1}KB`;
        appendLog(message);
    });
});

// 开始监听目标端口TCP_PORT
server.listen(TCP_PORT, function () {
    appendLog(`Socket server start on port ${TCP_PORT}.`);
    appendLog(server.address());
});

// 将输出带上时间戳写到tcp.log文件中
function appendLog(msg) {
    let timeString = new Date().toLocaleString('en-US')
    if(typeof msg === 'object') {
        try {
            msg = JSON.stringify(msg);
        } catch (err) {
        }
    }
    fs.writeFileSync(logFile, `[${timeString}]: ${msg}\n`, {flag:'a'});
}
