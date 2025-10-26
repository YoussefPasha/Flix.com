import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Content } from '../../content/entities/content.entity';
import { Rating } from '../../ratings/entities/rating.entity';

export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('reviews')
@Index(['contentId'])
@Index(['userId'])
@Index(['status'])
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  contentId: string;

  @Column({ type: 'uuid', nullable: true })
  ratingId: string;

  @Column({ type: 'text' })
  reviewText: string;

  @Column({ type: 'int', default: 0 })
  likes: number;

  @Column({ type: 'int', default: 0 })
  dislikes: number;

  @Column({ type: 'boolean', default: false })
  isModerated: boolean;

  @Column({
    type: 'enum',
    enum: ReviewStatus,
    default: ReviewStatus.PENDING,
  })
  status: ReviewStatus;

  @ManyToOne(() => Content, (content) => content.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'contentId' })
  content: Content;

  @ManyToOne(() => Rating, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'ratingId' })
  rating: Rating;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
