const ws = require('ws');
let wsServer = new ws.Server({ port: 8080 });

// Mảng lưu trữ tin nhắn
let messageHistory = [];

wsServer.on('connection', (socket) => {
    console.log('New connection to server!');

    // Gửi lại lịch sử tin nhắn cho client mới kết nối
    messageHistory.forEach((message) => {
        socket.send(message);
    });

    socket.on('message', (data) => {
        console.log('Received data: ' + data.toString());

        // Lưu tin nhắn vào mảng messageHistory
        messageHistory.push(data.toString());

        // Gửi tin nhắn tới tất cả các client khác
        broadcast(data.toString(), socket);
    });
});

function broadcast(data, socketToOmit) {
    wsServer.clients.forEach((connection) => {
        if (connection !== socketToOmit && connection.readyState === ws.OPEN) {
            console.log('Sending data to client');
            connection.send(data);
        }
    });
}
