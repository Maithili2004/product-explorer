import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum ScrapeJobStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum ScrapeTargetType {
  NAVIGATION = 'navigation',
  CATEGORY = 'category',
  PRODUCT = 'product',
  PRODUCT_DETAIL = 'product_detail',
}

@Entity('scrape_job')
@Index(['status'])
@Index(['createdAt'])
@Index(['targetType'])
export class ScrapeJob {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 500 })
  targetUrl!: string;

  @Column({ type: 'enum', enum: ScrapeTargetType })
  targetType!: ScrapeTargetType;

  @Column({ type: 'enum', enum: ScrapeJobStatus, default: ScrapeJobStatus.PENDING })
  status!: ScrapeJobStatus;

  @Column({ type: 'integer', default: 0 })
  retryCount!: number;

  @Column({ type: 'text', nullable: true })
  errorLog?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  startedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  finishedAt?: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'varchar', length: 36, nullable: true })
  targetId?: string;
}
