"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="jest" />
const testing_1 = require("@nestjs/testing");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("./../src/app.module");
describe('AppModule (e2e)', () => {
    let app;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
    });
    afterAll(async () => {
        await app.close();
    });
    describe('Health Check', () => {
        it('should return health status', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .get('/api/v1/health')
                .expect(200)
                .expect((res) => {
                expect(res.body).toBeDefined();
            });
        });
    });
    describe('Navigation Endpoints', () => {
        it('GET /navigation should return array', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .get('/api/v1/navigation')
                .expect(200)
                .expect((res) => {
                expect(Array.isArray(res.body)).toBe(true);
            });
        });
    });
    describe('Categories Endpoints', () => {
        it('GET /categories should return array', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .get('/api/v1/categories')
                .expect(200)
                .expect((res) => {
                expect(Array.isArray(res.body)).toBe(true);
            });
        });
    });
    describe('Products Endpoints', () => {
        it('GET /products should return paginated data', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .get('/api/v1/products')
                .expect(200)
                .expect((res) => {
                expect(res.body).toHaveProperty('data');
                expect(res.body).toHaveProperty('total');
                expect(res.body).toHaveProperty('limit');
                expect(res.body).toHaveProperty('offset');
            });
        });
    });
    describe('Scraping Endpoints', () => {
        it('POST /scraping/world-of-books should trigger real scraper', async () => {
            const response = await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/v1/scraping/world-of-books')
                .expect(200);
            expect(response.body).toBeDefined();
            expect(response.body).toHaveProperty('success');
            expect(typeof response.body.success).toBe('boolean');
        }, 60000); // 60 second timeout for scraping
    });
});
//# sourceMappingURL=app.e2e-spec.js.map