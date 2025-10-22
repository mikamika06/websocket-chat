'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { PersonaSelector, PersonaType } from '@/components/PersonaSelector';

export default function Home() {
    const [username, setUsername] = useState('');
    const [inputUsername, setInputUsername] = useState('');
    const [hasJoined, setHasJoined] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const [currentChat, setCurrentChat] = useState('Assistant');
    const [selectedPersona, setSelectedPersona] = useState<PersonaType>('general');

    const { isConnected, messages, streamingMessages, sendMessage, sendTyping, onlineUsers } = useSocket(username, currentChat);
    
    const currentMessages = useMemo(() => messages[currentChat] || [], [messages, currentChat]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [currentMessages, streamingMessages]);

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputUsername.trim()) {
            setUsername(inputUsername);
            setHasJoined(true);
        }
    };

    if (!hasJoined) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
                    <h1 className="text-3xl font-bold text-center mb-2 text-gray-800 dark:text-white">
                        WebSocket Chat
                    </h1>
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                        Enter to start chatting
                    </p>
                    <form onSubmit={handleJoin} className="space-y-4">
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Your name
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={inputUsername}
                                onChange={(e) => setInputUsername(e.target.value)}
                                placeholder="Enter your name"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                autoFocus
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!inputUsername.trim()}
                            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            Enter the chat
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <div className="max-w-6xl mx-auto h-screen flex gap-4 py-4">
                <div className="w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 flex flex-col">
                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Chats</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {isConnected ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    Online
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    Offline
                                </span>
                            )}
                        </p>
                    </div>

                    <button
                        onClick={() => setCurrentChat('Assistant')}
                        className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-all ${
                            currentChat === 'Assistant'
                                ? 'bg-blue-500 text-white shadow-md'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <div className="flex-1">
                                <div className="font-medium">Assistant</div>
                                <div className="text-xs opacity-75">AI Chat</div>
                            </div>
                        </div>
                    </button>

                    <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                    <div className="flex-1 overflow-y-auto">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                            Online users ({onlineUsers.length})
                        </h3>
                        {onlineUsers.length === 0 ? (
                            <p className="text-xs text-gray-400 dark:text-gray-500 italic">No one is here yet</p>
                        ) : (
                            <div className="space-y-1">
                                {onlineUsers.map((user) => (
                                    <button
                                        key={user}
                                        onClick={() => setCurrentChat(user)}
                                        className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                                            currentChat === user
                                                ? 'bg-blue-500 text-white shadow-md'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                            <span className="font-medium">{user}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{username}</div>
                        <button
                            onClick={() => {
                                setHasJoined(false);
                                setUsername('');
                                setInputUsername('');
                            }}
                            className="w-full px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Exit
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex flex-col">
                    <div className="bg-white dark:bg-gray-800 rounded-t-2xl shadow-xl p-4 border-b border-gray-200 dark:border-gray-700">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                            {currentChat === 'Assistant' ? ' AI Assistant' : ` Chat with ${currentChat}`}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            {currentChat === 'Assistant' 
                                ? 'Ask questions to the AI assistant' 
                                : `Private conversation with ${currentChat}`}
                        </p>
                        
                        {currentChat === 'Assistant' && (
                            <PersonaSelector 
                                currentPersona={selectedPersona} 
                                setPersona={setSelectedPersona} 
                            />
                        )}
                    </div>

                    <div className="flex-1 bg-white dark:bg-gray-800 overflow-y-auto p-4 space-y-2">
                        {currentMessages.length === 0 && streamingMessages.size === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-500 dark:text-gray-400 text-center">
                                    No messages yet. Start chatting!
                                </p>
                            </div>
                        ) : (
                            <>
                                {currentMessages.map((message) => (
                                    <ChatMessage
                                        key={message.id}
                                        message={message}
                                        isOwnMessage={message.username === username}
                                    />
                                ))}
                                {Array.from(streamingMessages.values()).map((streamMsg) => (
                                    <ChatMessage
                                        key={streamMsg.messageId}
                                        message={{
                                            id: streamMsg.messageId,
                                            username: streamMsg.username,
                                            text: streamMsg.text,
                                            timestamp: Date.now(),
                                        }}
                                        isOwnMessage={false}
                                        isStreaming={true}
                                    />
                                ))}
                            </>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-b-2xl shadow-xl p-4 border-t border-gray-200 dark:border-gray-700">
                        <ChatInput
                            onSendMessage={async (text) => {
                                sendMessage(text, currentChat);
                                
                                if (currentChat === 'Assistant') {
                                    try {
                                        await fetch('/api/assistant', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ 
                                                username, 
                                                text, 
                                                topic: selectedPersona
                                            }),
                                        });
                                    } catch (e) {
                                        console.error('Assistant call failed', e);
                                    }
                                }
                            }}
                            onTyping={sendTyping}
                            disabled={!isConnected}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
