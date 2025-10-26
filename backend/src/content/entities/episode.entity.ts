import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Season } from './season.entity';

@Entity('episodes')
export class Episode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  episodeNumber: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', nullable: true, comment: 'Duration in minutes' })
  duration: number;

  @Column({ type: 'uuid' })
  seasonId: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  videoUrl: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  thumbnailUrl: string;

  @Column({ type: 'date', nullable: true })
  releaseDate: Date;

  @ManyToOne(() => Season, (season) => season.episodes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'seasonId' })
  season: Season;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
