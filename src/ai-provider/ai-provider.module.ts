import { Module } from '@nestjs/common';
import { AiProviderFactory } from './ai-provider.factory';
import { OpenAiProvider } from './providers/openai.provider';
import { ConfigModule } from '../config/config.module';
import { AiProviderController } from './ai-provider.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [AiProviderController],
  providers: [AiProviderFactory, OpenAiProvider],
  exports: [AiProviderFactory],
})
export class AiProviderModule {}
