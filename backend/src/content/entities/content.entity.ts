import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm';
import { Season } from './season.entity';
import { Genre } from '../../genres/entities/genre.entity';
import { Tag } from '../../tags/entities/tag.entity';
import { CastCrew } from '../../cast-crew/entities/cast-crew.entity';
import { Rating } from '../../ratings/entities/rating.entity';
import { Review } from '../../reviews/entities/review.entity';

export enum ContentType {
  MOVIE = 'movie',
  SHOW = 'show',
}

export enum ContentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('content')
@Index(['type'])
@Index(['status'])
@Index(['rating'])
@Index(['releaseDate'])
export class Content {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @Index()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date', nullable: true })
  releaseDate: Date;

  @Column({ type: 'int', nullable: true, comment: 'Duration in minutes' })
  duration: number;

  @Column({
    type: 'enum',
    enum: ContentType,
    default: ContentType.MOVIE,
  })
  type: ContentType;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  ratingCount: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  thumbnailUrl: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  trailerUrl: string;

  @Column({
    type: 'enum',
    enum: ContentStatus,
    default: ContentStatus.DRAFT,
  })
  status: ContentStatus;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Season, (season) => season.content, {
    cascade: true,
  })
  seasons: Season[];

  @ManyToMany(() => Genre, (genre) => genre.contents)
  @JoinTable({
    name: 'content_genres',
    joinColumn: { name: 'contentId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'genreId', referencedColumnName: 'id' },
  })
  genres: Genre[];

  @ManyToMany(() => Tag, (tag) => tag.contents)
  @JoinTable({
    name: 'content_tags',
    joinColumn: { name: 'contentId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @ManyToMany(() => CastCrew, (castCrew) => castCrew.contents)
  @JoinTable({
    name: 'content_cast_crew',
    joinColumn: { name: 'contentId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'castCrewId', referencedColumnName: 'id' },
  })
  castCrew: CastCrew[];

  @OneToMany(() => Rating, (rating) => rating.content)
  ratings: Rating[];

  @OneToMany(() => Review, (review) => review.content)
  reviews: Review[];
}
