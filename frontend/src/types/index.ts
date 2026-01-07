export interface Navigation {
  id: string;
  title: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  lastScrapedAt?: string;
}

export interface Category {
  id: string;
  navigationId: string;
  parentId?: string;
  title: string;
  slug: string;
  description?: string;
  productCount: number;
  sourceUrl: string;
  sourceId?: string;
  createdAt: string;
  updatedAt: string;
  lastScrapedAt?: string;
  children?: Category[];
}

export interface Product {
  id: string;
  categoryId: string;
  title: string;
  author?: string;
  price?: number;
  currency: string;
  imageUrl?: string;
  sourceUrl: string;
  sourceId: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  lastScrapedAt?: string;
  details?: ProductDetail;
  reviews?: Review[];
}

export interface ProductDetail {
  id: string;
  productId: string;
  fullDescription?: string;
  ratingsAvg?: number;
  reviewsCount: number;
  specs?: Record<string, any>;
  isbn?: string;
  publisher?: string;
  publicationDate?: string;
  format?: string;
  pages?: number;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  author?: string;
  rating: number;
  text: string;
  helpfulCount: number;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface ScrapeJob {
  id: string;
  targetUrl: string;
  targetType: 'navigation' | 'category' | 'product' | 'product_detail';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  retryCount: number;
  errorLog?: string;
  metadata?: Record<string, any>;
  startedAt: string;
  finishedAt?: string;
  updatedAt: string;
  targetId?: string;
}
