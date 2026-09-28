import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async getUserSubscription(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId }
    });
    if (!subscription) {
      return { plan: 'FREE', remainingRequests: 10, expiresAt: new Date() };
    }
    return subscription;
  }

  async incrementUsage(userId: string) {
    const sub = await this.prisma.subscription.findUnique({ where: { userId } });
    if (!sub) {
      throw new NotFoundException('Subscription not found');
    }

    if (sub.plan !== 'ENTERPRISE' && sub.remainingRequests <= 0) {
      throw new BadRequestException('Usage limit exceeded for current billing period');
    }

    if (sub.plan !== 'ENTERPRISE') {
      return this.prisma.subscription.update({
        where: { userId },
        data: {
          remainingRequests: sub.remainingRequests - 1
        }
      });
    }

    return sub;
  }

  async updatePlan(userId: string, plan: string) {
    const limits = plan === 'PREMIUM' ? 1000 : 100;
    return this.prisma.subscription.upsert({
      where: { userId },
      update: { plan, remainingRequests: limits, status: 'ACTIVE' },
      create: { userId, plan, remainingRequests: limits, status: 'ACTIVE' },
    });
  }

  async checkLimits(userId: string) {
    const sub = await this.prisma.subscription.findUnique({ where: { userId } });
    if (!sub) return { used: 0 };
    const limits = sub.plan === 'PREMIUM' ? 1000 : 100;
    return { used: limits - sub.remainingRequests };
  }
}
