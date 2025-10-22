import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message } from '@/types/socket';

interface StreamingMessage {
    messageId: string;
    username: string;
    text: string;
    isStreaming: boolean;
}

export const useSocket = (username: string, currentChat: string) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<Record<string, Message[]>>({});
    const [streamingMessages, setStreamingMessages] = useState<Map<string, StreamingMessage>>(new Map());
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

    useEffect(() => {
        const socketInstance = io({
            path: '/api/socket',
        });

        socketInstance.on('connect', () => {
            console.log('Connected to server');
            setIsConnected(true);
            socketInstance.emit('join', username);
        });

        socketInstance.on('disconnect', () => {
            console.log('Disconnected from server');
            setIsConnected(false);
        });
        
        socketInstance.on('users-list', (users: string[]) => {
            console.log('[Socket] Online users:', users);
            setOnlineUsers(users.filter(u => u && u.trim() && u !== username));
        });

        socketInstance.on('message', (message: Message & { chatWith?: string }) => {
            console.log('[Socket] Received message:', message);
            
            if (message.username.includes('Assistant') || 
                    message.username.includes('Linus') || 
                    message.username.includes('Marco') || 
                    message.username.includes('Hans')) {
                setMessages((prev) => ({
                    ...prev,
                    ['Assistant']: [...(prev['Assistant'] || []), message],
                }));
            } 
            else if (message.chatWith) {
                const chatKey = message.username === username ? message.chatWith : message.username;
                setMessages((prev) => ({
                    ...prev,
                    [chatKey]: [...(prev[chatKey] || []), message],
                }));
            }
            else {
                setMessages((prev) => ({
                    ...prev,
                    [message.username]: [...(prev[message.username] || []), message],
                }));
            }
        });

        socketInstance.on('user-joined', () => {
        });

        socketInstance.on('user-left', () => {
        });

        socketInstance.on('user-typing', () => {
        });

        socketInstance.on('assistant-typing-start', (data: { messageId: string; username: string }) => {
            console.log('[Socket] Assistant started typing:', data.username);
            setStreamingMessages((prev) => {
                const newMap = new Map(prev);
                newMap.set(data.messageId, {
                    messageId: data.messageId,
                    username: data.username,
                    text: '',
                    isStreaming: true,
                });
                return newMap;
            });
        });

        socketInstance.on('assistant-typing-chunk', (data: { messageId: string; chunk: string }) => {
            console.log('[Socket] Assistant chunk:', data.chunk);
            setStreamingMessages((prev) => {
                const newMap = new Map(prev);
                const existing = newMap.get(data.messageId);
                if (existing) {
                    newMap.set(data.messageId, {
                        ...existing,
                        text: existing.text + data.chunk,
                    });
                }
                return newMap;
            });
        });

        socketInstance.on('assistant-typing-end', (data: { messageId: string; username: string; fullText: string; timestamp: number }) => {
            console.log('[Socket] Assistant finished typing');
            
            setStreamingMessages((prev) => {
                const newMap = new Map(prev);
                newMap.delete(data.messageId);
                return newMap;
            });
            
            const finalMessage: Message = {
                id: data.messageId,
                username: data.username,
                text: data.fullText,
                timestamp: data.timestamp,
            };
            setMessages((prev) => ({
                ...prev,
                ['Assistant']: [...(prev['Assistant'] || []), finalMessage],
            }));
        });

        socketInstance.on('assistant-error', (data: { messageId: string; error: string; username?: string }) => {
            console.error('Assistant error:', data.error);
            
            setStreamingMessages((prev) => {
                const newMap = new Map(prev);
                newMap.delete(data.messageId);
                return newMap;
            });
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [username]);

    useEffect(() => {
        setStreamingMessages(new Map());
    }, [currentChat]);

    const sendMessage = (text: string, chatWith?: string) => {
        if (socket && text.trim()) {
            socket.emit('message', { text, chatWith });
        }
    };

    const sendTyping = (isTyping: boolean) => {
        if (socket) {
            socket.emit('typing', isTyping);
        }
    };

    return {
        socket,
        isConnected,
        messages,
        streamingMessages,
        onlineUsers,
        sendMessage,
        sendTyping,
    };
};
