import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { NavigationService } from './navigation.service';

@Controller('navigation')
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @Get()
  async getAll() {
    return this.navigationService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.navigationService.findById(id);
  }

  @Post()
  async create(@Body() body: { title: string; slug?: string; description?: string }) {
    return this.navigationService.create(body);
  }

  @Post('scrape')
  async triggerScrape() {
    // This will be implemented in the scraping module
    return { message: 'Scrape job queued' };
  }
}
