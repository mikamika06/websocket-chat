import React from 'react';
import { Message } from '@/types/socket';

interface ChatMessageProps {
    message: Message;
    isOwnMessage: boolean;
    isStreaming?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwnMessage, isStreaming = false }) => {
    const isSystem = message.username === 'System';
    
    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    if (isSystem) {
        return (
            <div className="flex justify-center my-2">
                <span className="text-sm text-gray-500 italic px-4 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                    {message.text}
                </span>
            </div>
        );
    }

    return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
                {!isOwnMessage && (
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 px-2">
                        {message.username}
                        {isStreaming && (
                            <span className="ml-2 inline-flex items-center">
                                <span className="animate-pulse text-blue-500">●</span>
                                <span className="ml-1 text-xs text-blue-500">typing...</span>
                            </span>
                        )}
                    </span>
                )}
                <div
                    className={`px-4 py-2 rounded-2xl ${
                        isOwnMessage
                            ? 'bg-blue-500 text-white rounded-br-sm'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-sm'
                    } ${isStreaming ? 'animate-pulse' : ''}`}
                >
                    <p className="text-sm break-words whitespace-pre-wrap">{message.text}</p>
                    {isStreaming && message.text && (
                        <span className="inline-block w-1 h-4 bg-current ml-1 animate-blink" />
                    )}
                </div>
                {!isStreaming && (
                    <span className="text-xs text-gray-500 mt-1 px-2">
                        {formatTime(message.timestamp)}
                    </span>
                )}
            </div>
        </div>
    );
};
