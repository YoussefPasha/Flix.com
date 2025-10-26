import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CastCrewService } from './cast-crew.service';
import { CastCrewController } from './cast-crew.controller';
import { CastCrew } from './entities/cast-crew.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CastCrew])],
  controllers: [CastCrewController],
  providers: [CastCrewService],
  exports: [CastCrewService],
})
export class CastCrewModule {}
