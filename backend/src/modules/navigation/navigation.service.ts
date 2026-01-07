import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Navigation } from '../../database/entities';

@Injectable()
export class NavigationService {
  private readonly logger = new Logger(NavigationService.name);

  constructor(
    @InjectRepository(Navigation)
    private readonly navigationRepository: Repository<Navigation>,
  ) {}

  async findAll() {
    try {
      return await this.navigationRepository.find({
        order: { createdAt: 'ASC' },
      });
    } catch (error) {
      // Return empty array if table doesn't exist yet
      this.logger.warn('Navigation table not found, returning empty array');
      return [];
    }
  }

  async findById(id: string) {
    const navigation = await this.navigationRepository.findOne({ where: { id } });
    if (!navigation) {
      throw new NotFoundException(`Navigation with ID ${id} not found`);
    }
    return navigation;
  }

  async findBySlug(slug: string) {
    const navigation = await this.navigationRepository.findOne({ where: { slug } });
    if (!navigation) {
      throw new NotFoundException(`Navigation with slug ${slug} not found`);
    }
    return navigation;
  }

  async create(data: { title: string; slug?: string; description?: string }) {
    const slug = data.slug || this.generateSlug(data.title);

    const existing = await this.navigationRepository.findOne({ where: { slug } });
    if (existing) {
      throw new BadRequestException(`Navigation with slug ${slug} already exists`);
    }

    const navigation = this.navigationRepository.create({
      title: data.title,
      slug,
      description: data.description,
    });

    return this.navigationRepository.save(navigation);
  }

  async update(id: string, data: Partial<Navigation>) {
    const navigation = await this.findById(id);
    Object.assign(navigation, data);
    return this.navigationRepository.save(navigation);
  }

  async delete(id: string) {
    const navigation = await this.findById(id);
    return this.navigationRepository.remove(navigation);
  }

  async updateLastScrapedAt(id: string) {
    return this.navigationRepository.update(id, {
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
