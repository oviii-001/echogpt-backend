export interface GenerateChatRequest {
  messages: Array<{ role: 'user' | 'assistant' | 'system', content: string }>;
  model?: string;
  temperature?: number;
}

export interface GenerateChatResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AiProvider {
  getName(): string;
  generateChat(request: GenerateChatRequest): Promise<GenerateChatResponse>;
}
