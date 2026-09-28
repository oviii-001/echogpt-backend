import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const totalUsers = await this.prisma.user.count();
    const totalSearches = await this.prisma.webSearch.count();
    const totalConversations = await this.prisma.conversation.count();
    const usageLogs = await this.prisma.apiUsageLog.count();

    return { totalUsers, totalSearches, totalConversations, totalApiRequests: usageLogs };
  }

  async getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        subscription: true,
      }
    });
  }

  async getUsageLogs() {
    return this.prisma.apiUsageLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        user: { select: { email: true } }
      }
    });
  }
}
