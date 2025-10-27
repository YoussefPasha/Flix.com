import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Content, ContentType } from './entities/content.entity';
import { Season } from './entities/season.entity';
import { Episode } from './entities/episode.entity';
import { Genre } from '../genres/entities/genre.entity';
import { Tag } from '../tags/entities/tag.entity';
import { CastCrew } from '../cast-crew/entities/cast-crew.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ContentQueryDto } from './dto/content-query.dto';
import { CreateSeasonDto } from './dto/create-season.dto';
import { CreateEpisodeDto } from './dto/create-episode.dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
    @InjectRepository(Season)
    private seasonRepository: Repository<Season>,
    @InjectRepository(Episode)
    private episodeRepository: Repository<Episode>,
    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(CastCrew)
    private castCrewRepository: Repository<CastCrew>,
  ) {}

  async create(createContentDto: CreateContentDto): Promise<Content> {
    const contentData: Partial<Content> = {
      title: createContentDto.title,
      description: createContentDto.description,
      type: createContentDto.type,
      duration: createContentDto.duration,
      thumbnailUrl: createContentDto.thumbnailUrl,
      trailerUrl: createContentDto.trailerUrl,
      status: createContentDto.status,
    };

    if (createContentDto.releaseDate) {
      contentData.releaseDate = new Date(createContentDto.releaseDate);
    }

    const content = this.contentRepository.create(contentData);

    // Handle relations
    if (createContentDto.genreIds?.length) {
      content.genres = await this.genreRepository.findBy({
        id: In(createContentDto.genreIds),
      });
    }

    if (createContentDto.tagIds?.length) {
      content.tags = await this.tagRepository.findBy({
        id: In(createContentDto.tagIds),
      });
    }

    if (createContentDto.castCrewIds?.length) {
      content.castCrew = await this.castCrewRepository.findBy({
        id: In(createContentDto.castCrewIds),
      });
    }

    return this.contentRepository.save(content);
  }

  async findAll(query: ContentQueryDto) {
    const { page = 1, limit = 20, type, status, genreId, search } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.contentRepository
      .createQueryBuilder('content')
      .leftJoinAndSelect('content.genres', 'genre')
      .leftJoinAndSelect('content.tags', 'tag')
      .leftJoinAndSelect('content.seasons', 'season');

    if (type) {
      queryBuilder.andWhere('content.type = :type', { type });
    }

    if (status) {
      queryBuilder.andWhere('content.status = :status', { status });
    }

    if (genreId) {
      queryBuilder.andWhere('genre.id = :genreId', { genreId });
    }

    if (search) {
      queryBuilder.andWhere('content.title ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [data, total] = await queryBuilder
      .orderBy('content.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Content> {
    const content = await this.contentRepository.findOne({
      where: { id },
      relations: [
        'genres',
        'tags',
        'castCrew',
        'seasons',
        'seasons.episodes',
        'ratings',
        'reviews',
      ],
    });

    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }

    return content;
  }

  async update(
    id: string,
    updateContentDto: UpdateContentDto,
  ): Promise<Content> {
    const content = await this.findOne(id);

    Object.assign(content, {
      ...updateContentDto,
      releaseDate: updateContentDto.releaseDate
        ? new Date(updateContentDto.releaseDate)
        : content.releaseDate,
    });

    // Handle relations
    if (updateContentDto.genreIds) {
      content.genres = await this.genreRepository.findBy({
        id: In(updateContentDto.genreIds),
      });
    }

    if (updateContentDto.tagIds) {
      content.tags = await this.tagRepository.findBy({
        id: In(updateContentDto.tagIds),
      });
    }

    if (updateContentDto.castCrewIds) {
      content.castCrew = await this.castCrewRepository.findBy({
        id: In(updateContentDto.castCrewIds),
      });
    }

    return this.contentRepository.save(content);
  }

  async remove(id: string): Promise<void> {
    const content = await this.findOne(id);
    await this.contentRepository.remove(content);
  }

  // Season management
  async addSeason(
    contentId: string,
    createSeasonDto: CreateSeasonDto,
  ): Promise<Season> {
    const content = await this.findOne(contentId);

    if (content.type !== ContentType.SHOW) {
      throw new BadRequestException('Seasons can only be added to TV shows');
    }

    const seasonData: Partial<Season> = {
      seasonNumber: createSeasonDto.seasonNumber,
      title: createSeasonDto.title,
      description: createSeasonDto.description,
      contentId,
    };

    if (createSeasonDto.releaseDate) {
      seasonData.releaseDate = new Date(createSeasonDto.releaseDate);
    }

    const season = this.seasonRepository.create(seasonData);
    return this.seasonRepository.save(season);
  }

  async getSeasons(contentId: string): Promise<Season[]> {
    return this.seasonRepository.find({
      where: { contentId },
      relations: ['episodes'],
      order: { seasonNumber: 'ASC' },
    });
  }

  // Episode management
  async addEpisode(
    contentId: string,
    seasonId: string,
    createEpisodeDto: CreateEpisodeDto,
  ): Promise<Episode> {
    const content = await this.findOne(contentId);

    if (content.type !== ContentType.SHOW) {
      throw new BadRequestException('Episodes can only be added to TV shows');
    }

    const season = await this.seasonRepository.findOne({
      where: { id: seasonId, contentId },
    });

    if (!season) {
      throw new NotFoundException(`Season with ID ${seasonId} not found`);
    }

    const episodeData: Partial<Episode> = {
      episodeNumber: createEpisodeDto.episodeNumber,
      title: createEpisodeDto.title,
      description: createEpisodeDto.description,
      duration: createEpisodeDto.duration,
      videoUrl: createEpisodeDto.videoUrl,
      thumbnailUrl: createEpisodeDto.thumbnailUrl,
      seasonId,
    };

    if (createEpisodeDto.releaseDate) {
      episodeData.releaseDate = new Date(createEpisodeDto.releaseDate);
    }

    const episode = this.episodeRepository.create(episodeData);
    return this.episodeRepository.save(episode);
  }

  async getEpisodes(contentId: string, seasonId: string): Promise<Episode[]> {
    const season = await this.seasonRepository.findOne({
      where: { id: seasonId, contentId },
    });

    if (!season) {
      throw new NotFoundException(`Season with ID ${seasonId} not found`);
    }

    return this.episodeRepository.find({
      where: { seasonId },
      order: { episodeNumber: 'ASC' },
    });
  }
}
