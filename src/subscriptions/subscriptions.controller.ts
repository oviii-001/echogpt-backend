import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Subscriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get current subscription status' })
  getStatus(@CurrentUser() user: any) {
    return this.subscriptionsService.getUserSubscription(user.sub);
  }

  @Post('upgrade')
  @ApiOperation({ summary: 'Upgrade subscription to PREMIUM' })
  upgrade(@CurrentUser() user: any) {
    return this.subscriptionsService.updatePlan(user.sub, 'PREMIUM');
  }

  @Post('downgrade')
  @ApiOperation({ summary: 'Downgrade subscription to FREE' })
  downgrade(@CurrentUser() user: any) {
    return this.subscriptionsService.updatePlan(user.sub, 'FREE');
  }

  @Get('usage')
  @ApiOperation({ summary: 'Get current usage and limits' })
  async getUsage(@CurrentUser() user: any) {
    const limits = await this.subscriptionsService.checkLimits(user.sub);
    const sub = await this.subscriptionsService.getUserSubscription(user.sub);
    const max = sub?.plan === 'PREMIUM' ? 1000 : 100;
    
    return {
      used: limits.used,
      remaining: max - limits.used,
      limit: max,
      plan: sub?.plan || 'FREE'
    };
  }
}
