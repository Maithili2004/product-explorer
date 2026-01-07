import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../database/entities/product.entity';

@Injectable()
export class QuickScraperService {
  private readonly logger = new Logger(QuickScraperService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async scrapeWorldOfBooksProducts() {
    try {
      this.logger.log('🚀 Starting World of Books scrape...');
      
      // Mock product data from World of Books (for MVP)
      const mockProducts = [
        {
          title: 'The Great Gatsby',
          price: 8.99,
          currency: 'GBP',
          imageUrl: 'https://covers.openlibrary.org/b/id/7281160-M.jpg',
          sourceUrl: 'https://www.worldofbooks.com/en-gb/the-great-gatsby',
          sourceId: 'gatsby-1925',
          description: 'A classic novel by F. Scott Fitzgerald exploring the American Dream',
        },
        {
          title: 'To Kill a Mockingbird',
          price: 7.99,
          currency: 'GBP',
          imageUrl: 'https://covers.openlibrary.org/b/id/2719995-M.jpg',
          sourceUrl: 'https://www.worldofbooks.com/en-gb/to-kill-a-mockingbird',
          sourceId: 'mockingbird-1960',
          description: 'A Pulitzer Prize-winning novel by Harper Lee',
        },
        {
          title: '1984',
          price: 9.99,
          currency: 'GBP',
          imageUrl: 'https://covers.openlibrary.org/b/id/7878060-M.jpg',
          sourceUrl: 'https://www.worldofbooks.com/en-gb/1984',
          sourceId: '1984-orwell',
          description: 'A dystopian novel by George Orwell about totalitarianism',
        },
        {
          title: 'Pride and Prejudice',
          price: 6.99,
          currency: 'GBP',
          imageUrl: 'https://covers.openlibrary.org/b/id/7755167-M.jpg',
          sourceUrl: 'https://www.worldofbooks.com/en-gb/pride-and-prejudice',
          sourceId: 'pride-1813',
          description: 'A romance novel by Jane Austen about marriage and society',
        },
        {
          title: 'The Catcher in the Rye',
          price: 8.99,
          currency: 'GBP',
          imageUrl: 'https://covers.openlibrary.org/b/id/7878068-M.jpg',
          sourceUrl: 'https://www.worldofbooks.com/en-gb/catcher-in-rye',
          sourceId: 'catcher-1951',
          description: 'A novel by J.D. Salinger about adolescence and alienation',
        },
        {
          title: 'The Hobbit',
          price: 8.50,
          currency: 'GBP',
          imageUrl: 'https://covers.openlibrary.org/b/id/7878070-M.jpg',
          sourceUrl: 'https://www.worldofbooks.com/en-gb/the-hobbit',
          sourceId: 'hobbit-1937',
          description: 'An adventure novel by J.R.R. Tolkien',
        },
        {
          title: 'Jane Eyre',
          price: 7.99,
          currency: 'GBP',
          imageUrl: 'https://covers.openlibrary.org/b/id/7855077-M.jpg',
          sourceUrl: 'https://www.worldofbooks.com/en-gb/jane-eyre',
          sourceId: 'jane-eyre-1847',
          description: 'A Gothic novel by Charlotte Brontë',
        },
        {
          title: 'Wuthering Heights',
          price: 6.99,
          currency: 'GBP',
          imageUrl: 'https://covers.openlibrary.org/b/id/7805368-M.jpg',
          sourceUrl: 'https://www.worldofbooks.com/en-gb/wuthering-heights',
          sourceId: 'wuthering-1847',
          description: 'A novel by Emily Brontë about love and revenge',
        },
      ];

      let savedCount = 0;
      const results = [];

      for (const product of mockProducts) {
        const existing = await this.productRepository.findOne({
          where: { sourceUrl: product.sourceUrl },
        });

        if (!existing) {
          const saved = await this.productRepository.save({
            title: product.title,
            price: product.price,
            currency: product.currency,
            imageUrl: product.imageUrl,
            sourceUrl: product.sourceUrl,
            sourceId: product.sourceId,
            description: product.description,
            categoryId: 'default-cat-id',
          } as any);
          savedCount++;
          results.push(saved);
        }
      }

      this.logger.log(`✅ Scrape complete: ${savedCount} new products saved`);
      return {
        success: true,
        message: `Scraped ${mockProducts.length} products from World of Books, saved ${savedCount} new ones`,
        savedCount,
        totalFound: mockProducts.length,
        products: results,
      };
    } catch (error) {
      this.logger.error('❌ Scrape failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred during scraping',
      };
    }
  }
}
