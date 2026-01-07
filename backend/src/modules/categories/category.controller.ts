import { Controller, Get, Param, Query } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAll(@Query('navigationId') navigationId?: string) {
    return this.categoryService.findAll(navigationId);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const category = await this.categoryService.findById(id);
    return category || {}; // Return empty object if not found
  }

  @Get(':id/subcategories')
  async getSubcategories(@Param('id') id: string) {
    return this.categoryService.getSubcategories(id);
  }
}
