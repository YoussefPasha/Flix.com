import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { databaseConfig } from './config/database.config';
import { ContentModule } from './content/content.module';
import { GenresModule } from './genres/genres.module';
import { TagsModule } from './tags/tags.module';
import { CastCrewModule } from './cast-crew/cast-crew.module';
import { RatingsModule } from './ratings/ratings.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: '.env',
    }),
    DatabaseModule,
    ContentModule,
    GenresModule,
    TagsModule,
    CastCrewModule,
    RatingsModule,
    ReviewsModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
