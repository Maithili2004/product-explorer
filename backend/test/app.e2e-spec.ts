/// <reference types="jest" />
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Set the global prefix like the main app does
    app.setGlobalPrefix('api/v1');
    await app.init();
    // Wait for app to fully initialize
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('should return health status', () => {
      return request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(200)
        .expect((res: any) => {
          expect(res.body).toBeDefined();
        });
    });
  });

  describe('Navigation Endpoints', () => {
    it('GET /navigation should return array', () => {
      return request(app.getHttpServer())
        .get('/api/v1/navigation')
        .expect(200)
        .expect((res: any) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('Categories Endpoints', () => {
    it('GET /categories should return array', () => {
      return request(app.getHttpServer())
        .get('/api/v1/categories')
        .expect(200)
        .expect((res: any) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('Products Endpoints', () => {
    it('GET /products should return paginated data', () => {
      return request(app.getHttpServer())
        .get('/api/v1/products')
        .expect(200)
        .expect((res: any) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('limit');
          expect(res.body).toHaveProperty('offset');
        });
    });
  });

  describe('Scraping Endpoints', () => {
    it('POST /scraping/world-of-books should trigger real scraper', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/scraping/world-of-books')
        .expect(201); // 201 Created is the correct status

      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('success');
      expect(typeof response.body.success).toBe('boolean');
    }, 120000); // 120 second timeout for live scraping
  });
});
