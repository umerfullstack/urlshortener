;

var Socket = {
    sendLatestUpdate: function (event, clientId, data) {
        // let socketId = Sockets[clientId];
        if (true) {
            // console.log('i am here')
            io.sockets.to(clientId).emit(event, data);
            // io.sockets.connected[socketId].to(`${commonRoom}`).emit(event, data);
        } else {
            // console.log('======== Client not login with client id', clientId)
        }
    }


};

io.on("connection", (socket) => {

    socket.on("joinRoom", (room) => {
        // console.log('joinRoom > ', room)
        socket.join(room);
    });
    socket.on("leaveRoom", (room) => {
        // console.log('leaveRoom > ', room)
        socket.leave(room);
    });
    socket.on("disconnect", () => {
        // console.log('Client Disconnected > ', socket.id)
    });
});

exports.Socket = Socket;
exports.io = io;
