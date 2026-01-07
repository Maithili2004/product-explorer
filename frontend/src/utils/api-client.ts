import axios, { AxiosInstance } from 'axios';
import type {
  Navigation,
  Category,
  Product,
  ProductDetail,
  Review,
  PaginatedResponse,
  ScrapeJob,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Navigation endpoints
  async getNavigations() {
    const { data } = await this.client.get<Navigation[]>('/navigation');
    return data;
  }

  async getNavigation(id: string) {
    const { data } = await this.client.get<Navigation>(`/navigation/${id}`);
    return data;
  }

  async scrapeNavigations() {
    const { data } = await this.client.post<ScrapeJob>('/scraping/navigation/scrape');
    return data;
  }

  // Category endpoints
  async getCategories(navigationId?: string) {
    const params = navigationId ? { navigationId } : {};
    const { data } = await this.client.get<Category[]>('/categories', { params });
    return data;
  }

  async getCategory(id: string) {
    const { data } = await this.client.get<Category>(`/categories/${id}`);
    return data;
  }

  async getSubcategories(parentId: string) {
    const { data } = await this.client.get<Category[]>(
      `/categories/${parentId}/subcategories`,
    );
    return data;
  }

  async scrapeCategory(categoryId: string) {
    const { data } = await this.client.post<ScrapeJob>(
      `/scraping/category/${categoryId}/scrape`,
    );
    return data;
  }

  // Product endpoints
  async getProducts(categoryId?: string, limit: number = 20, offset: number = 0) {
    const params = { limit, offset, ...(categoryId && { categoryId }) };
    const { data } = await this.client.get<PaginatedResponse<Product>>('/products', {
      params,
    });
    return data;
  }

  async getProduct(id: string) {
    const { data } = await this.client.get<Product>(`/products/${id}`);
    return data;
  }

  async getProductReviews(productId: string, limit: number = 10, offset: number = 0) {
    const { data } = await this.client.get<PaginatedResponse<Review>>(
      `/products/${productId}/reviews`,
      { params: { limit, offset } },
    );
    return data;
  }

  async getRelatedProducts(productId: string, limit: number = 5) {
    const { data } = await this.client.get<Product[]>(
      `/products/${productId}/related`,
      { params: { limit } },
    );
    return data;
  }

  async scrapeProductDetail(productId: string) {
    const { data } = await this.client.post<ScrapeJob>(
      `/scraping/product/${productId}/scrape`,
    );
    return data;
  }

  // Health endpoint
  async healthCheck() {
    const { data } = await this.client.get('/health');
    return data;
  }
}

export const apiClient = new ApiClient();
