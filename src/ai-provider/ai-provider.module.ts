import { Module } from '@nestjs/common';
import { AiProviderFactory } from './ai-provider.factory';
import { OpenAiProvider } from './providers/openai.provider';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [AiProviderFactory, OpenAiProvider],
  exports: [AiProviderFactory],
})
export class AiProviderModule {}
