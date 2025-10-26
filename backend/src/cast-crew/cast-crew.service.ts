import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CastCrew } from './entities/cast-crew.entity';
import { CreateCastCrewDto } from './dto/create-cast-crew.dto';
import { UpdateCastCrewDto } from './dto/update-cast-crew.dto';

@Injectable()
export class CastCrewService {
  constructor(
    @InjectRepository(CastCrew)
    private castCrewRepository: Repository<CastCrew>,
  ) {}

  async create(createCastCrewDto: CreateCastCrewDto): Promise<CastCrew> {
    const castCrewData: Partial<CastCrew> = {
      name: createCastCrewDto.name,
      role: createCastCrewDto.role,
      bio: createCastCrewDto.bio,
      imageUrl: createCastCrewDto.imageUrl,
      nationality: createCastCrewDto.nationality,
    };

    if (createCastCrewDto.birthDate) {
      castCrewData.birthDate = new Date(createCastCrewDto.birthDate);
    }

    const castCrew = this.castCrewRepository.create(castCrewData);
    return this.castCrewRepository.save(castCrew);
  }

  async findAll(): Promise<CastCrew[]> {
    return this.castCrewRepository.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<CastCrew> {
    const castCrew = await this.castCrewRepository.findOne({
      where: { id },
      relations: ['contents'],
    });

    if (!castCrew) {
      throw new NotFoundException(`Cast/Crew with ID ${id} not found`);
    }

    return castCrew;
  }

  async update(
    id: string,
    updateCastCrewDto: UpdateCastCrewDto,
  ): Promise<CastCrew> {
    const castCrew = await this.findOne(id);

    Object.assign(castCrew, {
      ...updateCastCrewDto,
      birthDate: updateCastCrewDto.birthDate
        ? new Date(updateCastCrewDto.birthDate)
        : castCrew.birthDate,
    });

    return this.castCrewRepository.save(castCrew);
  }

  async remove(id: string): Promise<void> {
    const castCrew = await this.findOne(id);
    await this.castCrewRepository.remove(castCrew);
  }
}
