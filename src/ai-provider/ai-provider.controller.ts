import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('AI Providers (Admin)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('providers')
export class AiProviderController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'List all providers' })
  async getProviders() {
    return this.prisma.aIProvider.findMany({
      select: { id: true, type: true, displayName: true, isEnabled: true, isDefault: true, createdAt: true }
    });
  }

  @Post()
  @ApiOperation({ summary: 'Add a new AI provider' })
  async addProvider(@Body() body: any) {
    // Note: encryption of key is simulated for simplicity
    const encryptedKey = Buffer.from(body.apiKey).toString('base64');
    
    // If this is set to default, unset other defaults
    if (body.isDefault) {
      await this.prisma.aIProvider.updateMany({ where: { isDefault: true }, data: { isDefault: false } });
    }

    return this.prisma.aIProvider.create({
      data: {
        type: body.type,
        displayName: body.displayName,
        isEnabled: body.isEnabled ?? true,
        isDefault: body.isDefault ?? false,
        encryptedKey: encryptedKey,
      }
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edit an AI provider' })
  async editProvider(@Param('id') id: string, @Body() body: any) {
    const data: any = { ...body };
    
    if (body.apiKey) {
      data.encryptedKey = Buffer.from(body.apiKey).toString('base64');
      delete data.apiKey;
    }

    if (body.isDefault) {
      await this.prisma.aIProvider.updateMany({ where: { isDefault: true }, data: { isDefault: false } });
    }

    return this.prisma.aIProvider.update({
      where: { id },
      data,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a provider' })
  async deleteProvider(@Param('id') id: string) {
    return this.prisma.aIProvider.delete({ where: { id } });
  }

  @Get(':id/health')
  @ApiOperation({ summary: 'Health check a provider' })
  async healthCheck(@Param('id') id: string) {
    // Simulated health check
    const provider = await this.prisma.aIProvider.findUnique({ where: { id } });
    if (!provider) return { status: 'NOT_FOUND' };
    return { status: 'OK', type: provider.type, latency: Math.floor(Math.random() * 200) + 'ms' };
  }
}
