import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, Index, ForeignKey, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_detail')
@Index(['productId'], { unique: true })
export class ProductDetail {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @ForeignKey(() => Product)
  productId!: string;

  @Column({ type: 'text', nullable: true })
  fullDescription?: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  ratingsAvg?: number;

  @Column({ type: 'integer', default: 0 })
  reviewsCount!: number;

  @Column({ type: 'jsonb', nullable: true })
  specs?: Record<string, any>;

  @Column({ type: 'varchar', length: 255, nullable: true })
  isbn?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  publisher?: string;

  @Column({ type: 'date', nullable: true })
  publicationDate?: Date;

  @Column({ type: 'text', nullable: true })
  format?: string;

  @Column({ type: 'integer', nullable: true })
  pages?: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToOne(() => Product, (product: Product) => product.details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product!: Product;
}
