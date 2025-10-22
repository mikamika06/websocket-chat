import { ChatState } from '../types';

export class GraphState {
  messages: ChatState['messages'];
  topic: string;
  username: string;
  persona: string;
  streaming: boolean;
  messageId: string;

  constructor(initial: Partial<ChatState> = {}) {
    this.messages = initial.messages || [];
    this.topic = initial.topic || 'General';
    this.username = initial.username || 'User';
    this.persona = initial.persona || 'Assistant';
    this.streaming = initial.streaming || false;
    this.messageId = initial.messageId || '';
  }

  addMessage(role: 'user' | 'assistant' | 'system', content: string) {
    this.messages.push({
      role,
      content,
      timestamp: Date.now(),
    });
  }

  getLastUserMessage(): string {
    const userMessages = this.messages.filter((m) => m.role === 'user');
    return userMessages[userMessages.length - 1]?.content || '';
  }

  getConversationHistory(): string {
    return this.messages
      .map((m) => `${m.role}: ${m.content}`)
      .join('\n');
  }
}
