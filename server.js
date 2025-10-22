const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true);
            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error('Error occurred handling', req.url, err);
            res.statusCode = 500;
            res.end('internal server error');
        }
    });

    const io = new Server(httpServer, {
        path: '/api/socket',
        addTrailingSlash: false,
    });

    globalThis.io = io;

    const onlineUsers = new Map();

    const broadcastUsersList = () => {
        const users = Array.from(onlineUsers.values());
        io.emit('users-list', users);
    };

    io.on('connection', (socket) => {
        console.log('New connection:', socket.id);

        socket.on('join', (username) => {
            if (!username || !username.trim()) {
                console.log('Rejected empty username');
                return;
            }
            
            socket.data.username = username.trim();
            onlineUsers.set(socket.id, username.trim());
            
            socket.broadcast.emit('user-joined', {
                username: username.trim(),
                timestamp: Date.now(),
            });
            
            broadcastUsersList();
            
            console.log(`${username.trim()} joined the chat`);
        });

        socket.on('message', (data) => {
            const message = {
                id: Math.random().toString(36).substring(7),
                username: socket.data.username || 'Anonymous',
                text: data.text,
                timestamp: Date.now(),
                chatWith: data.chatWith,
            };
            
            if (data.chatWith) {
                socket.emit('message', message);
                
                const recipientSocket = Array.from(io.sockets.sockets.values()).find(
                    s => s.data.username === data.chatWith
                );
                if (recipientSocket) {
                    recipientSocket.emit('message', message);
                }
            } else {
                io.emit('message', message);
            }
            
            console.log('Message sent:', message);
        });

        socket.on('typing', (isTyping) => {
            socket.broadcast.emit('user-typing', {
                username: socket.data.username,
                isTyping,
            });
        });

        socket.on('disconnect', () => {
            if (socket.data.username) {
                onlineUsers.delete(socket.id);
                
                socket.broadcast.emit('user-left', {
                    username: socket.data.username,
                    timestamp: Date.now(),
                });
                
                broadcastUsersList();
                
                console.log(`${socket.data.username} left the chat`);
            }
        });
    });

    httpServer
        .once('error', (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});
