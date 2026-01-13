import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('view_history')
@Index(['sessionId'])
@Index(['createdAt'])
export class ViewHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sessionId?: string;

  @Column({ type: 'text' })
  pathJson!: Record<string, any>;

  @Column({ type: 'varchar', length: 500, nullable: true })
  referrer?: string;

  @Column({ type: 'text', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  createdAt!: Date;
}
