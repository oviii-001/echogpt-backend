import { Injectable, BadRequestException } from '@nestjs/common';
import { AiProvider, GenerateChatRequest, GenerateChatResponse } from './ai-provider.interface';
import { OpenAiProvider } from './providers/openai.provider';
// other providers would be imported here

@Injectable()
export class AiProviderFactory {
  constructor(private openAiProvider: OpenAiProvider) {}

  getProvider(providerName: string): AiProvider {
    switch (providerName.toUpperCase()) {
      case 'OPENAI':
        return this.openAiProvider;
      // case 'ANTHROPIC':
      // case 'GEMINI':
      default:
        throw new BadRequestException(`Unsupported provider: ${providerName}`);
    }
  }
}
