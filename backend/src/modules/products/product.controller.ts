import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAll(
    @Query('categoryId') categoryId?: string,
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
  ) {
    return this.productService.findAll(categoryId, limit, offset);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @Get(':id/reviews')
  async getReviews(
    @Param('id') id: string,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    return this.productService.getReviews(id, limit, offset);
  }

  @Get(':id/related')
  async getRelated(@Param('id') id: string, @Query('limit') limit: number = 5) {
    return this.productService.getRelated(id, limit);
  }
}
