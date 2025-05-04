const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

class WebSocketService {
    constructor() {
        this.clients = new Map(); // userId -> WebSocket
    }

    initialize(server) {
        this.wss = new WebSocket.Server({ 
            server,
            verifyClient: (info, callback) => {
                // Verify JWT token from query parameters
                const token = info.req.url.split('token=')[1];
                if (!token) {
                    callback(false, 401, 'Unauthorized');
                    return;
                }

                try {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    info.req.user = decoded;
                    callback(true);
                } catch (error) {
                    callback(false, 401, 'Unauthorized');
                }
            }
        });

        this.wss.on('connection', (ws, req) => {
            const userId = req.user.id;
            
            if (userId) {
                this.clients.set(userId, ws);
                console.log(`Client connected: ${userId}`);
            }

            ws.on('message', (message) => {
                this.handleMessage(ws, message, userId);
            });

            ws.on('close', () => {
                if (userId) {
                    this.clients.delete(userId);
                    console.log(`Client disconnected: ${userId}`);
                }
            });
        });
    }

    handleMessage(ws, message, senderId) {
        try {
            const data = JSON.parse(message);
            
            switch (data.type) {
                case 'typing':
                    this.broadcastTyping(data, senderId);
                    break;
                case 'message':
                    this.broadcastMessage(data, senderId);
                    break;
                default:
                    console.log('Unknown message type:', data.type);
            }
        } catch (error) {
            console.error('Error handling message:', error);
        }
    }

    broadcastMessage(data, senderId) {
        const { receiverId, message } = data;
        const receiverWs = this.clients.get(receiverId);
        
        if (receiverWs) {
            receiverWs.send(JSON.stringify({
                type: 'newMessage',
                message,
                senderId
            }));
        }
    }

    broadcastTyping(data, senderId) {
        const { receiverId, isTyping } = data;
        const receiverWs = this.clients.get(receiverId);
        
        if (receiverWs) {
            receiverWs.send(JSON.stringify({
                type: 'typing',
                isTyping,
                senderId
            }));
        }
    }

    sendToUser(userId, data) {
        const ws = this.clients.get(userId);
        if (ws) {
            ws.send(JSON.stringify(data));
        }
    }
}

module.exports = new WebSocketService(); 