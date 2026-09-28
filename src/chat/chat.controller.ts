import { Controller, Post, Body, Param, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateConversationDto, CreateMessageDto } from './dto/chat.dto';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(
    private chatService: ChatService,
    private prisma: PrismaService
  ) {}

  @ApiOperation({ summary: 'Create a new conversation' })
  @ApiResponse({ status: 201, description: 'Conversation created successfully.' })
  @Post('conversations')
  createConversation(@CurrentUser() user: any, @Body() dto: CreateConversationDto) {
    return this.chatService.createConversation(user.sub, dto.title);
  }

  @ApiOperation({ summary: 'Get user conversations' })
  @ApiResponse({ status: 200, description: 'List of conversations.' })
  @Get('conversations')
  getConversations(@CurrentUser() user: any) {
    return this.prisma.conversation.findMany({ where: { userId: user.sub } });
  }

  @ApiOperation({ summary: 'Send a message in a conversation' })
  @ApiResponse({ status: 201, description: 'Message sent and AI response generated.' })
  @Post('conversations/:id/messages')
  sendMessage(
    @CurrentUser() user: any, 
    @Param('id') conversationId: string, 
    @Body() dto: CreateMessageDto
  ) {
    return this.chatService.sendMessage(user.sub, conversationId, dto);
  }

  @ApiOperation({ summary: 'Get messages for a conversation' })
  @ApiResponse({ status: 200, description: 'List of messages.' })
  @Get('conversations/:id/messages')
  getMessages(@CurrentUser() user: any, @Param('id') conversationId: string) {
    return this.prisma.message.findMany({ where: { conversationId }, orderBy: { createdAt: 'asc' } });
  }
}
