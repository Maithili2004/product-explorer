import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaywrightCrawler } from 'crawlee';
import * as crypto from 'crypto';
import { ScrapeJob, ScrapeJobStatus, ScrapeTargetType } from '../../database/entities';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);
  private readonly baseUrl = process.env.WOB_BASE_URL || 'https://www.worldofbooks.com';
  private readonly retryAttempts = parseInt(process.env.WOB_RETRY_ATTEMPTS || '3');
  private readonly retryDelay = parseInt(process.env.WOB_RETRY_DELAY || '2000');
  private readonly timeout = parseInt(process.env.WOB_TIMEOUT || '30000');

  constructor(
    @InjectRepository(ScrapeJob)
    private readonly scrapeJobRepository: Repository<ScrapeJob>,
  ) {}

  async scrapeNavigationHeadings(): Promise<any[]> {
    this.logger.log('Starting navigation headings scrape');

    try {
      const results: any[] = [];
      const logger = this.logger;

      const crawler = new PlaywrightCrawler({
        maxRequestsPerCrawl: 1,
        useSessionPool: false,
        async requestHandler({ page }: any) {
          logger.debug('Scraping navigation from homepage');

          // Extract navigation headings
          const headings = await page.$$eval('.nav-link, [role="navigation"] a', (elements: any[]) =>
            elements.map((el: any) => ({
              text: el.textContent?.trim() || '',
              url: el.getAttribute('href') || '',
            })),
          );

          // Filter and deduplicate
          const unique = Array.from(
            new Map(headings.filter((h: any) => h.text).map((h: any) => [h.text, h])).values(),
          );

          results.push(...unique);

          logger.debug(`Found ${unique.length} navigation headings`);
        },
      });

      await crawler.run([this.baseUrl]);
      return results;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error('Navigation scrape failed', message);
      throw error;
    }
  }

  async scrapeCategory(categoryUrl: string): Promise<any> {
    this.logger.log(`Scraping category: ${categoryUrl}`);

    try {
      const result: any = {
        title: '',
        subcategories: [],
        products: [],
      };
      const logger = this.logger;

      const crawler = new PlaywrightCrawler({
        maxRequestsPerCrawl: 1,
        useSessionPool: false,
        async requestHandler({ page }: any) {
          // Extract category title
          result.title =
            (await page.$eval('h1', (el: any) => el.textContent?.trim() || '')) ||
            (await page.$eval('[role="heading"]', (el: any) => el.textContent?.trim() || ''));

          // Extract subcategories
          result.subcategories = await page.$$eval('a.category-link', (elements: any[]) =>
            elements.map((el: any) => ({
              text: el.textContent?.trim() || '',
              url: el.getAttribute('href') || '',
            })),
          );

          // Extract products
          result.products = await page.$$eval('[class*="product"], [class*="book"]', (elements: any[]) =>
            elements.slice(0, 20).map((el: any) => ({
              title:
                el.querySelector('h2, h3, [class*="title"]')?.textContent?.trim() || '',
              author:
                el.querySelector('[class*="author"]')?.textContent?.trim() ||
                el.querySelector('[class*="writer"]')?.textContent?.trim() ||
                '',
              price:
                el.querySelector('[class*="price"]')?.textContent?.trim() || '',
              image: el.querySelector('img')?.getAttribute('src') || '',
              url: el.querySelector('a')?.getAttribute('href') || '',
            })),
          );

          logger.debug(
            `Found ${result.subcategories.length} subcategories and ${result.products.length} products`,
          );
        },
      });

      await crawler.run([categoryUrl]);
      return result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Category scrape failed for ${categoryUrl}`, message);
      throw error;
    }
  }

  async scrapeProductDetail(productUrl: string): Promise<any> {
    this.logger.log(`Scraping product detail: ${productUrl}`);

    try {
      const result: any = {
        title: '',
        author: '',
        price: '',
        description: '',
        reviews: [],
        metadata: {},
      };
      const logger = this.logger;

      const crawler = new PlaywrightCrawler({
        maxRequestsPerCrawl: 1,
        useSessionPool: false,
        async requestHandler({ page }: any) {
          // Extract basic info
          result.title =
            (await page.$eval('h1', (el: any) => el.textContent?.trim() || '')) || '';
          result.author =
            (await page.$eval('[class*="author"]', (el: any) => el.textContent?.trim() || '')) ||
            '';
          result.price =
            (await page.$eval('[class*="price"]', (el: any) => el.textContent?.trim() || '')) || '';

          // Extract description
          result.description =
            (await page.$eval('[class*="description"], .product-desc', (el: any) =>
              el.textContent?.trim() || '',
            )) || '';

          // Extract reviews
          result.reviews = await page.$$eval('[class*="review"], .customer-review', (elements: any[]) =>
            elements.slice(0, 5).map((el: any) => ({
              author:
                el.querySelector('[class*="author"], .reviewer')?.textContent?.trim() || '',
              rating:
                el.querySelector('[class*="rating"], .stars')?.getAttribute('data-rating') || '0',
              text:
                el.querySelector('[class*="text"], .review-text')?.textContent?.trim() || '',
            })),
          );

          // Extract metadata
          const specs = await page.$$eval('[class*="spec"], [class*="detail"]', (elements: any[]) =>
            elements.map((el: any) => el.textContent?.trim() || ''),
          );

          result.metadata = {
            isbn: specs.find((s: string) => s.includes('ISBN')) || '',
            publisher: specs.find((s: string) => s.includes('Publisher')) || '',
            pages: specs.find((s: string) => s.includes('Pages')) || '',
          };

          logger.debug(`Extracted product details and ${result.reviews.length} reviews`);
        },
      });

      await crawler.run([productUrl]);
      return result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Product detail scrape failed for ${productUrl}`, message);
      throw error;
    }
  }

  async createScrapeJob(data: {
    targetUrl: string;
    targetType: ScrapeTargetType;
    targetId?: string;
    metadata?: Record<string, any>;
  }): Promise<ScrapeJob> {
    const job = this.scrapeJobRepository.create({
      ...data,
      status: ScrapeJobStatus.PENDING,
    });

    return this.scrapeJobRepository.save(job);
  }

  async updateJobStatus(
    jobId: string,
    status: ScrapeJobStatus,
    errorLog?: string,
  ): Promise<ScrapeJob> {
    const job = await this.scrapeJobRepository.findOne({ where: { id: jobId } });

    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    job.status = status;
    job.errorLog = errorLog;
    job.finishedAt = status === ScrapeJobStatus.COMPLETED || status === ScrapeJobStatus.FAILED
      ? new Date()
      : job.finishedAt;

    return this.scrapeJobRepository.save(job);
  }

  generateContentHash(data: any): string {
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(data))
      .digest('hex');
  }
}
