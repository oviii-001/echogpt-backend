import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Search')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post()
  search(@CurrentUser() user: any, @Body('query') query: string) {
    return this.searchService.search(user.sub, query);
  }

  @Get('history')
  getHistory(@CurrentUser() user: any) {
    return this.searchService.getHistory(user.sub);
  }

  @Get('recent')
  getRecentSearches(@CurrentUser() user: any) {
    // Lazy path: just return latest 5 history
    return this.searchService.getHistory(user.sub).then(res => res.slice(0, 5));
  }

  @Post('suggestions')
  getSuggestions(@Body('query') query: string) {
    // Lazy path: mock suggestions based on query
    if (!query) return [];
    return [`${query} api`, `${query} examples`, `how to ${query}`];
  }
}
