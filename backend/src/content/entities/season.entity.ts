import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Content } from './content.entity';
import { Episode } from './episode.entity';

@Entity('seasons')
export class Season {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  seasonNumber: number;

  @Column({ type: 'date', nullable: true })
  releaseDate: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'uuid' })
  contentId: string;

  @ManyToOne(() => Content, (content) => content.seasons, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'contentId' })
  content: Content;

  @OneToMany(() => Episode, (episode) => episode.season, {
    cascade: true,
  })
  episodes: Episode[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
