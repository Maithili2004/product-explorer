import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../database/entities';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(navigationId?: string) {
    try {
      const query = this.categoryRepository.createQueryBuilder('category');

      if (navigationId) {
        query.where('category.navigationId = :navigationId', { navigationId });
      }

      return await query.orderBy('category.title', 'ASC').getMany();
    } catch (error) {
      // Return empty array if table doesn't exist yet
      this.logger.warn('Category table not found, returning empty array');
      return [];
    }
  }

  async findById(id: string) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
        relations: ['navigation'],
      });

      // Return empty object if not found instead of throwing exception
      if (!category) {
        return null;
      }

      return category;
    } catch (error: any) {
      this.logger.warn(`Error finding category ${id}`, error?.message);
      return null;
    }
  }

  async findBySlug(slug: string, navigationId?: string) {
    const query = this.categoryRepository.createQueryBuilder('category');
    query.where('category.slug = :slug', { slug });

    if (navigationId) {
      query.andWhere('category.navigationId = :navigationId', { navigationId });
    }

    const category = await query.getOne();

    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }

    return category;
  }

  async getSubcategories(id: string) {
    try {
      return await this.categoryRepository.find({
        where: { parentId: id },
        order: { title: 'ASC' },
      });
    } catch (error: any) {
      this.logger.warn(`Error getting subcategories for ${id}`, error?.message);
      return [];
    }
  }

  async create(data: {
    navigationId: string;
    parentId?: string;
    title: string;
    slug?: string;
    description?: string;
  }) {
    const slug = data.slug || this.generateSlug(data.title);

    const category = this.categoryRepository.create({
      navigationId: data.navigationId,
      parentId: data.parentId,
      title: data.title,
      slug,
      description: data.description,
    });

    return this.categoryRepository.save(category);
  }

  async update(id: string, data: Partial<Category>) {
    const category = await this.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    Object.assign(category, data);
    return this.categoryRepository.save(category);
  }

  async delete(id: string) {
    const category = await this.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return this.categoryRepository.remove(category!);
  }

  async updateLastScrapedAt(id: string) {
    return this.categoryRepository.update(id, {
      lastScrapedAt: new Date(),
    });
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}
