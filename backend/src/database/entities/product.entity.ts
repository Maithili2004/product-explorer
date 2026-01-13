import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, Index, ForeignKey, JoinColumn } from 'typeorm';
import { Category } from './category.entity';
import { ProductDetail } from './product-detail.entity';
import { Review } from './review.entity';

@Entity('product')
@Index(['sourceId'], { unique: true })
@Index(['categoryId'])
@Index(['lastScrapedAt'])
@Index(['sourceUrl'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: true })
  @ForeignKey(() => Category)
  categoryId?: string;

  @Column({ type: 'varchar', length: 500 })
  title!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  author?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price?: number;

  @Column({ type: 'varchar', length: 10, default: 'GBP' })
  currency!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl?: string;

  @Column({ type: 'varchar', length: 500 })
  sourceUrl!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  sourceId!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'datetime', nullable: true })
  lastScrapedAt?: Date;

  @Column({ type: 'varchar', length: 64, nullable: true })
  contentHash?: string;

  @ManyToOne(() => Category, (category: Category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category!: Category;

  @OneToMany(() => ProductDetail, (detail: ProductDetail) => detail.product, { cascade: true })
  details!: ProductDetail;

  @OneToMany(() => Review, (review: Review) => review.product, { cascade: true })
  reviews!: Review[];
}
