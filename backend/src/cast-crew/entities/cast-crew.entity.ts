import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Content } from '../../content/entities/content.entity';

export enum CastCrewRole {
  ACTOR = 'actor',
  DIRECTOR = 'director',
  PRODUCER = 'producer',
  WRITER = 'writer',
  CINEMATOGRAPHER = 'cinematographer',
}

@Entity('cast_crew')
export class CastCrew {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({
    type: 'enum',
    enum: CastCrewRole,
    default: CastCrewRole.ACTOR,
  })
  role: CastCrewRole;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nationality: string;

  @ManyToMany(() => Content, (content) => content.castCrew)
  contents: Content[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
