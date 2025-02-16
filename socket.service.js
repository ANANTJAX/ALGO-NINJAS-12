const socketIO = require('socket.io');

class SocketService {
    initialize(server) {
        this.io = socketIO(server);
        
        this.io.on('connection', (socket) => {
            socket.on('join', (userId) => {
                socket.join(userId);
            });
        });
    }

    emitToUser(userId, event, data) {
        this.io.to(userId).emit(event, data);
    }
}

module.exports = new SocketService(); 