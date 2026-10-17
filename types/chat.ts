export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessagePart {
  type: 'text' | 'reasoning';
  text: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  parts?: ChatMessagePart[];
  createdAt: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  modelId: string;
  createdAt: number;
  updatedAt: number;
}

export type ModelProvider = 'groq' | 'fireworks' | 'openai' | 'anthropic' | 'mock';

export interface AIModel {
  id: string;
  name: string;
  provider: ModelProvider;
  providerName: string;
  description: string;
  badge?: string;
  isDefault?: boolean;
}

export type ChatStreamingStatus = 'ready' | 'submitted' | 'streaming' | 'error';
