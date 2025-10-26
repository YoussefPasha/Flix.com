import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { Content } from './entities/content.entity';
import { Season } from './entities/season.entity';
import { Episode } from './entities/episode.entity';
import { Genre } from '../genres/entities/genre.entity';
import { Tag } from '../tags/entities/tag.entity';
import { CastCrew } from '../cast-crew/entities/cast-crew.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Content, Season, Episode, Genre, Tag, CastCrew]),
  ],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
