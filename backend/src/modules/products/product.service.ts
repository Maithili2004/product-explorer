import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductDetail, Review } from '../../database/entities';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductDetail)
    private readonly productDetailRepository: Repository<ProductDetail>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async findAll(
    categoryId?: string,
    limit: number = 20,
    offset: number = 0,
  ) {
    try {
      const query = this.productRepository.createQueryBuilder('product');

      if (categoryId) {
        query.where('product.categoryId = :categoryId', { categoryId });
      }

      const [products, total] = await Promise.all([
        query
          .leftJoinAndSelect('product.details', 'details')
          .orderBy('product.createdAt', 'DESC')
          .skip(offset)
          .take(limit)
          .getMany(),
        query.getCount(),
      ]);

      return { data: products, total, limit, offset };
    } catch (error) {
      // Return empty array if table doesn't exist yet
      this.logger.warn('Product table not found, returning empty array');
      return { data: [], total: 0, limit, offset };
    }
  }

  async findById(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'details', 'reviews'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findBySourceId(sourceId: string) {
    return this.productRepository.findOne({
      where: { sourceId },
      relations: ['category', 'details', 'reviews'],
    });
  }

  async create(data: {
    categoryId: string;
    title: string;
    author?: string;
    price?: number;
    currency?: string;
    imageUrl?: string;
    sourceUrl: string;
    sourceId: string;
    description?: string;
    contentHash?: string;
  }) {
    // Check for existing product
    const existing = await this.productRepository.findOne({
      where: { sourceId: data.sourceId },
    });

    if (existing) {
      // Update if content changed
      if (existing.contentHash === data.contentHash) {
        this.logger.debug(`Product ${data.sourceId} has unchanged content, skipping`);
        return existing;
      }
      Object.assign(existing, data);
      return this.productRepository.save(existing);
    }

    const product = this.productRepository.create(data);
    return this.productRepository.save(product);
  }

  async createDetail(productId: string, data: any) {
    const existing = await this.productDetailRepository.findOne({
      where: { productId },
    });

    if (existing) {
      Object.assign(existing, data);
      return this.productDetailRepository.save(existing);
    }

    const detail = this.productDetailRepository.create({
      productId,
      ...data,
    });

    return this.productDetailRepository.save(detail);
  }

  async addReview(productId: string, review: { author?: string; rating: number; text: string }) {
    const product = await this.findById(productId);

    const newReview = this.reviewRepository.create({
      productId,
      ...review,
    });

    await this.reviewRepository.save(newReview);

    // Update product detail
    const detail = await this.productDetailRepository.findOne({ where: { productId } });
    if (detail) {
      detail.reviewsCount = (detail.reviewsCount || 0) + 1;
      await this.productDetailRepository.save(detail);
    }

    return newReview;
  }

  async getReviews(productId: string, limit: number = 10, offset: number = 0) {
    const [reviews, total] = await this.reviewRepository.findAndCount({
      where: { productId },
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });

    return { data: reviews, total, limit, offset };
  }

  async getRelated(productId: string, limit: number = 5) {
    const product = await this.findById(productId);

    const related = await this.productRepository.find({
      where: {
        categoryId: product.categoryId,
      },
      relations: ['details'],
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return related.filter((p) => p.id !== productId);
  }

  async updateLastScrapedAt(id: string) {
    return this.productRepository.update(id, {
      lastScrapedAt: new Date(),
    });
  }
}
