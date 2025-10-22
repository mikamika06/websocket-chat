
export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

export interface ChatState {
  messages: Message[];
  topic: string;
  username: string;
  persona: string;
  streaming: boolean;
  messageId: string;
}

export interface StreamChunk {
  messageId: string;
  chunk: string;
  username: string;
  done: boolean;
}

export interface AgentPersona {
  name: string;
  systemPrompt: string;
  personality: string;
  expertise: string[];
}

export type TopicType = 
  | 'general'     
  | 'einstein'  
  | 'sherlock'    
  | 'ironman'     
  | 'shakespeare' 
  | 'musk'; 
