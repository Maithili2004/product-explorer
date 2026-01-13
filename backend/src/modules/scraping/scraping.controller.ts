import { Controller, Post, Get, Param } from '@nestjs/common';
// import { ScrapeQueueService } from './scrape-queue.service';
import { QuickScraperService } from './quick-scraper.service';

@Controller('scraping')
export class ScrapingController {
  constructor(
    // private readonly scrapeQueueService: ScrapeQueueService,
    private readonly quickScraperService: QuickScraperService,
  ) {}

  @Post('world-of-books')
  async scrapeWorldOfBooks() {
    return this.quickScraperService.scrapeWorldOfBooksProducts();
  }

  @Post('navigation/scrape')
  async scrapeNavigation() {
    return {
      success: false,
      message: 'Navigation scrape not available - requires Redis',
    };
    // return this.scrapeQueueService.queueNavigationScrape();
  }

  @Post('category/:id/scrape')
  async scrapeCategory(@Param('id') categoryId: string) {
    return {
      success: false,
      message: 'Category scrape not available - requires Redis',
    };
    // const categoryUrl = `https://www.worldofbooks.com/category/${categoryId}`;
    // return this.scrapeQueueService.queueCategoryScrape(categoryUrl, categoryId);
  }

  @Post('product/:id/scrape')
  async scrapeProduct(@Param('id') productId: string) {
    return {
      success: false,
      message: 'Product scrape not available - requires Redis',
    };
    // const productUrl = `https://www.worldofbooks.com/product/${productId}`;
    // return this.scrapeQueueService.queueProductDetailScrape(productUrl, productId);
  }
}
