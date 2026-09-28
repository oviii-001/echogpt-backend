import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { AiProviderModule } from './ai-provider/ai-provider.module';
import { ChatModule } from './chat/chat.module';
import { SearchModule } from './search/search.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [ConfigModule, PrismaModule, HealthModule, AuthModule, UsersModule, SubscriptionsModule, AiProviderModule, ChatModule, SearchModule, AdminModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
