import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, Index, ForeignKey, JoinColumn } from 'typeorm';
import { Navigation } from './navigation.entity';
import { Product } from './product.entity';

@Entity('category')
@Index(['navigationId'])
@Index(['parentId'])
@Index(['slug'])
@Index(['lastScrapedAt'])
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @ForeignKey(() => Navigation)
  navigationId!: string;

  @Column({ type: 'uuid', nullable: true })
  @ForeignKey(() => Category)
  parentId?: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'varchar', length: 255 })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'datetime', nullable: true })
  lastScrapedAt?: Date;

  @ManyToOne(() => Navigation, (nav: Navigation) => nav.categories)
  @JoinColumn({ name: 'navigationId' })
  navigation!: Navigation;

  @ManyToOne(() => Category, (cat: Category) => cat.children, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent?: Category;

  @OneToMany(() => Category, (cat: Category) => cat.parent)
  children!: Category[];

  @OneToMany(() => Product, (product: Product) => product.category)
  products!: Product[];
}
