import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiProviderFactory } from '../ai-provider/ai-provider.factory';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { CreateMessageDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private aiFactory: AiProviderFactory,
    private subscriptions: SubscriptionsService,
  ) {}

  async createConversation(userId: string, title: string) {
    return this.prisma.conversation.create({
      data: { userId, title }
    });
  }

  async sendMessage(userId: string, conversationId: string, dto: CreateMessageDto) {
    // 1. Check usage limits
    await this.subscriptions.incrementUsage(userId);

    // 2. Verify conversation belongs to user
    const conv = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!conv || conv.userId !== userId) throw new BadRequestException('Invalid conversation');

    // 3. Save user message
    await this.prisma.message.create({
      data: {
        conversationId,
        content: dto.content,
        role: 'USER'
      }
    });

    // 4. Get AI Provider
    const provider = this.aiFactory.getProvider(dto.provider || 'OPENAI');

    // 5. Fetch history (mocking to only send latest for brevity, usually fetch all)
    const messagesForAi = [{ role: 'user' as const, content: dto.content }];

    // 6. Generate response
    const aiResponse = await provider.generateChat({ messages: messagesForAi });

    // 7. Save AI response
    const savedMessage = await this.prisma.message.create({
      data: {
        conversationId,
        content: aiResponse.content,
        role: 'ASSISTANT'
      }
    });

    // 8. Log usage
    await this.prisma.apiUsageLog.create({
      data: {
        userId,
        requestCategory: 'CHAT',
        isSuccess: true,
        count: aiResponse.usage.totalTokens
      }
    });

    return savedMessage;
  }
}
