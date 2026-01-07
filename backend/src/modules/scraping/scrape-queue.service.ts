import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { ScraperService } from './scraper.service';
import { ScrapeTargetType, ScrapeJobStatus } from '../../database/entities';
import { NavigationService } from '../navigation/navigation.service';
import { CategoryService } from '../categories/category.service';
import { ProductService } from '../products/product.service';

@Injectable()
export class ScrapeQueueService {
  private readonly logger = new Logger(ScrapeQueueService.name);

  constructor(
    @InjectQueue('scraping') private scrapeQueue: Queue,
    private scraperService: ScraperService,
    private navigationService: NavigationService,
    private categoryService: CategoryService,
    private productService: ProductService,
  ) {
    this.setupProcessors();
  }

  private setupProcessors() {
    // Navigation scrape processor
    this.scrapeQueue.process('navigation', async (job) => {
      this.logger.log(`Processing navigation scrape job: ${job.id}`);
      const { jobId } = job.data;

      try {
        await this.scraperService.updateJobStatus(jobId, ScrapeJobStatus.RUNNING);

        const results = await this.scraperService.scrapeNavigationHeadings();

        // Save to database
        for (const heading of results) {
          const slug = heading.text.toLowerCase().replace(/\s+/g, '-');
          try {
            const existing = await this.navigationService.findBySlug(slug).catch(() => null);
            if (!existing) {
              await this.navigationService.create({
                title: heading.text,
                slug,
              });
            }
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            this.logger.warn(`Failed to save navigation: ${heading.text}`, msg);
          }
        }

        await this.scraperService.updateJobStatus(jobId, ScrapeJobStatus.COMPLETED);
        return { success: true, count: results.length };
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        this.logger.error('Navigation scrape failed', msg);
        await this.scraperService.updateJobStatus(
          jobId,
          ScrapeJobStatus.FAILED,
          msg,
        );
        throw error;
      }
    });

    // Category scrape processor
    this.scrapeQueue.process('category', async (job) => {
      this.logger.log(`Processing category scrape job: ${job.id}`);
      const { jobId, categoryId, categoryUrl } = job.data;

      try {
        await this.scraperService.updateJobStatus(jobId, ScrapeJobStatus.RUNNING);

        const result = await this.scraperService.scrapeCategory(categoryUrl);

        // Save products from category
        if (result.products && Array.isArray(result.products)) {
          for (const productData of result.products) {
            try {
              await this.productService.create({
                categoryId,
                title: productData.title || 'Unknown',
                author: productData.author,
                price: this.parsePrice(productData.price),
                imageUrl: productData.image,
                sourceUrl: productData.url,
                sourceId: this.generateSourceId(productData.url),
                contentHash: this.scraperService.generateContentHash(productData),
              });
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : String(err);
              this.logger.warn(`Failed to save product: ${productData.title}`, msg);
            }
          }
        }

        // Update category lastScrapedAt
        if (categoryId) {
          await this.categoryService.update(categoryId, {
            lastScrapedAt: new Date(),
          });
        }

        await this.scraperService.updateJobStatus(jobId, ScrapeJobStatus.COMPLETED);
        return { success: true, productCount: result.products?.length || 0 };
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        this.logger.error('Category scrape failed', msg);
        await this.scraperService.updateJobStatus(
          jobId,
          ScrapeJobStatus.FAILED,
          msg,
        );
        throw error;
      }
    });

    // Product detail scrape processor
    this.scrapeQueue.process('product_detail', async (job) => {
      this.logger.log(`Processing product detail scrape job: ${job.id}`);
      const { jobId, productId, productUrl } = job.data;

      try {
        await this.scraperService.updateJobStatus(jobId, ScrapeJobStatus.RUNNING);

        const result = await this.scraperService.scrapeProductDetail(productUrl);

        // Save product details
        await this.productService.createDetail(productId, {
          fullDescription: result.description,
          ratingsAvg: this.parseRating(result.reviews),
          reviewsCount: result.reviews?.length || 0,
          specs: result.metadata,
        });

        // Save reviews
        if (result.reviews && Array.isArray(result.reviews)) {
          for (const review of result.reviews) {
            try {
              await this.productService.addReview(productId, {
                author: review.author,
                rating: parseFloat(review.rating) || 0,
                text: review.text,
              });
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : String(err);
              this.logger.warn(`Failed to save review`, msg);
            }
          }
        }

        await this.scraperService.updateJobStatus(jobId, ScrapeJobStatus.COMPLETED);
        return { success: true, reviewCount: result.reviews?.length || 0 };
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        this.logger.error('Product detail scrape failed', msg);
        await this.scraperService.updateJobStatus(
          jobId,
          ScrapeJobStatus.FAILED,
          msg,
        );
        throw error;
      }
    });
  }

  async queueNavigationScrape() {
    const jobId = await this.scraperService.createScrapeJob({
      targetUrl: 'https://www.worldofbooks.com',
      targetType: ScrapeTargetType.NAVIGATION,
    });

    await this.scrapeQueue.add(
      'navigation',
      { jobId: jobId.id },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    );

    return jobId;
  }

  async queueCategoryScrape(categoryUrl: string, categoryId?: string) {
    const jobId = await this.scraperService.createScrapeJob({
      targetUrl: categoryUrl,
      targetType: ScrapeTargetType.CATEGORY,
      targetId: categoryId,
    });

    await this.scrapeQueue.add(
      'category',
      { jobId: jobId.id, categoryId, categoryUrl },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    );

    return jobId;
  }

  async queueProductDetailScrape(productUrl: string, productId?: string) {
    const jobId = await this.scraperService.createScrapeJob({
      targetUrl: productUrl,
      targetType: ScrapeTargetType.PRODUCT_DETAIL,
      targetId: productId,
    });

    await this.scrapeQueue.add(
      'product_detail',
      { jobId: jobId.id, productId, productUrl },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    );

    return jobId;
  }

  private parsePrice(priceStr: string): number | undefined {
    const match = priceStr.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : undefined;
  }

  private parseRating(reviews: any[]): number {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + (parseFloat(r.rating) || 0), 0);
    return sum / reviews.length;
  }

  private generateSourceId(url: string): string {
    return url.split('/').filter(Boolean).pop() || url;
  }
}
