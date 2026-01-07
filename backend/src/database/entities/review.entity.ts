import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Index, ForeignKey, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('review')
@Index(['productId'])
@Index(['createdAt'])
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @ForeignKey(() => Product)
  productId!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  author?: string;

  @Column({ type: 'decimal', precision: 3, scale: 2 })
  rating!: number;

  @Column({ type: 'text' })
  text!: string;

  @Column({ type: 'integer', default: 0 })
  helpfulCount!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Product, (product: Product) => product.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product!: Product;
}
