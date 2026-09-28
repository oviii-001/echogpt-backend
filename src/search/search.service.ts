import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(userId: string, query: string) {
    // Save to history
    await this.prisma.webSearch.create({
      data: { userId, query }
    });

    // Mock search results
    return {
      query,
      results: [
        { title: `Result 1 for ${query}`, url: 'https://example.com/1', snippet: 'Sample snippet 1' },
        { title: `Result 2 for ${query}`, url: 'https://example.com/2', snippet: 'Sample snippet 2' }
      ]
    };
  }

  async getHistory(userId: string) {
    return this.prisma.webSearch.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }
}
