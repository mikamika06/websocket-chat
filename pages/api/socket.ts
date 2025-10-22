import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import type { NextApiResponseServerIO } from '../../types/socket';

export const config = {
    api: {
        bodyParser: false,
    },
};

interface Message {
    id: string;
    username: string;
    text: string;
    timestamp: number;
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
    if (!res.socket.server.io) {
        console.log('Initializing Socket.IO server...');
        const httpServer = res.socket.server as unknown as NetServer;
        const io = new ServerIO(httpServer, {
            path: '/api/socket',
            addTrailingSlash: false,
        });

        res.socket.server.io = io;

        io.on('connection', (socket) => {
            console.log('New connection:', socket.id);

            socket.on('join', (username: string) => {
                socket.data.username = username;
                socket.broadcast.emit('user-joined', {
                    username,
                    timestamp: Date.now(),
                });
                console.log(`${username} joined the chat`);
            });

            socket.on('message', (data: { text: string }) => {
                const message: Message = {
                    id: Math.random().toString(36).substring(7),
                    username: socket.data.username || 'Anonymous',
                    text: data.text,
                    timestamp: Date.now(),
                };
                io.emit('message', message);
                console.log('Message sent:', message);
            });

            socket.on('typing', (isTyping: boolean) => {
                socket.broadcast.emit('user-typing', {
                    username: socket.data.username,
                    isTyping,
                });
            });

            socket.on('disconnect', () => {
                if (socket.data.username) {
                    socket.broadcast.emit('user-left', {
                        username: socket.data.username,
                        timestamp: Date.now(),
                    });
                    console.log(`${socket.data.username} left the chat`);
                }
            });
        });
    } else {
        console.log('Socket.IO server already running');
    }

    res.end();
};

export default ioHandler;
