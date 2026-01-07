import { Injectable, Logger } from '@nestjs/common';
import { chromium } from 'playwright';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Navigation } from '../../database/entities/navigation.entity';
import { Category } from '../../database/entities/category.entity';
import { Product } from '../../database/entities/product.entity';

@Injectable()
export class WorldOfBooksScraper {
  private readonly logger = new Logger(WorldOfBooksScraper.name);

  constructor(
    @InjectRepository(Navigation)
    private readonly navigationRepository: Repository<Navigation>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async scrapeHome() {
    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    try {
      const page = await browser.newPage();
      this.logger.log('Opening World of Books...');
      await page.goto('https://www.worldofbooks.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000);

      // Scrape navigation categories from homepage
      const navItems = await page.evaluate(() => {
        const items: any[] = [];
        // Try to find category/genre links
        document.querySelectorAll('a[href*="/category/"], a[href*="/genre/"], .nav a').forEach((el) => {
          const text = (el as HTMLElement).textContent?.trim();
          const href = (el as HTMLAnchorElement).href;
          if (text && href && text.length > 0 && text.length < 100) {
            items.push({ title: text, url: href });
          }
        });
        return items.filter((item, idx, arr) => arr.findIndex(i => i.title === item.title) === idx).slice(0, 10);
      });

      this.logger.log(`Found ${navItems.length} navigation items`);

      // Save navigation items
      for (const item of navItems) {
        const slug = item.title.toLowerCase().replace(/\s+/g, '-');
        const existing = await this.navigationRepository.findOne({ where: { slug } });
        
        if (!existing) {
          await this.navigationRepository.save({
            title: item.title,
            slug,
            description: `${item.title} books and more`,
          });
        }
      }

      await page.close();
      return { success: true, itemsFound: navItems.length };
    } catch (error: any) {
      this.logger.error('Scraping failed', error?.message);
      throw error;
    } finally {
      await browser.close();
    }
  }

  async scrapeProducts(categoryUrl: string) {
    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    try {
      const page = await browser.newPage();
      this.logger.log(`Scraping products from ${categoryUrl}`);
      await page.goto(categoryUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000);

      // Scrape product listings
      const products = await page.evaluate(() => {
        const items: any[] = [];
        
        // Try multiple selectors for product cards
        const selectors = [
          '.product-item',
          '[class*="product"]',
          '.book-item',
          '[class*="item"]',
          'a[href*="/product/"], a[href*="/item/"]',
        ];

        selectors.forEach(selector => {
          document.querySelectorAll(selector).forEach((el) => {
            const title = el.querySelector('h2, h3, .title, [class*="title"]')?.textContent?.trim() || '';
            const price = el.querySelector('.price, [class*="price"]')?.textContent?.trim() || '0';
            const image = (el.querySelector('img') as HTMLImageElement)?.src || '';
            const link = (el.querySelector('a') as HTMLAnchorElement)?.href || '';

            if (title && link) {
              items.push({ title, price, image, link });
            }
          });
        });

        // Remove duplicates
        return items.filter((item, idx, arr) => arr.findIndex(i => i.link === item.link) === idx).slice(0, 20);
      });

      this.logger.log(`Found ${products.length} products`);

      // Save products to DB
      for (const product of products) {
        const sourceId = product.link.split('/').filter((p: string) => p).pop() || 'unknown';
        
        const existing = await this.productRepository.findOne({
          where: { sourceUrl: product.link },
        });

        if (!existing) {
          await this.productRepository.save({
            title: product.title.substring(0, 500),
            price: parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0,
            currency: 'GBP',
            imageUrl: product.image,
            sourceUrl: product.link,
            sourceId,
            description: `Book from World of Books`,
            categoryId: 'default-cat-id',
          } as any);
        }
      }

      await page.close();
      return { success: true, productsFound: products.length };
    } catch (error: any) {
      this.logger.error('Product scraping failed', error?.message);
      throw error;
    } finally {
      await browser.close();
    }
  }
}
