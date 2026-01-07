import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ScrapeJob, Product } from '../../database/entities';
import { ScraperService } from './scraper.service';
import { ScrapeQueueService } from './scrape-queue.service';
import { QuickScraperService } from './quick-scraper.service';
import { ScrapingController } from './scraping.controller';
import { NavigationModule } from '../navigation/navigation.module';
import { CategoryModule } from '../categories/category.module';
import { ProductModule } from '../products/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScrapeJob, Product]),
    BullModule.registerQueue({
      name: 'scraping',
    }),
    NavigationModule,
    CategoryModule,
    ProductModule,
  ],
  controllers: [ScrapingController],
  providers: [ScraperService, ScrapeQueueService, QuickScraperService],
  exports: [ScrapeQueueService, QuickScraperService],
})
export class ScrapingModule {}
