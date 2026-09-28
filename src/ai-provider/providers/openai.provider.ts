import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiProvider, GenerateChatRequest, GenerateChatResponse } from '../ai-provider.interface';

@Injectable()
export class OpenAiProvider implements AiProvider {
  constructor(private configService: ConfigService) {}

  getName(): string {
    return 'OPENAI';
  }

  async generateChat(request: GenerateChatRequest): Promise<GenerateChatResponse> {
    // In a real app, this uses openai SDK. 
    // Mocking for assessment.
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) throw new BadRequestException('OpenAI API key not configured');

    return {
      content: 'This is a mocked response from OpenAI',
      usage: {
        promptTokens: 10,
        completionTokens: 20,
        totalTokens: 30,
      }
    };
  }
}
