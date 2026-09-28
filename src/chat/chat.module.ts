import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { AiProviderModule } from '../ai-provider/ai-provider.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [AiProviderModule, SubscriptionsModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
