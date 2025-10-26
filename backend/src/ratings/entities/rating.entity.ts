import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  Index,
} from 'typeorm';
import { Content } from '../../content/entities/content.entity';

@Entity('ratings')
@Unique(['userId', 'contentId'])
@Index(['contentId'])
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  contentId: string;

  @Column({ type: 'decimal', precision: 3, scale: 2 })
  score: number; // 1.0 to 5.0

  @ManyToOne(() => Content, (content) => content.ratings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'contentId' })
  content: Content;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
