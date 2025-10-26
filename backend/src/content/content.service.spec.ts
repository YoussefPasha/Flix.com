/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ContentService } from './content.service';
import { Content, ContentType, ContentStatus } from './entities/content.entity';
import { Season } from './entities/season.entity';
import { Episode } from './entities/episode.entity';
import { Genre } from '../genres/entities/genre.entity';
import { Tag } from '../tags/entities/tag.entity';
import { CastCrew } from '../cast-crew/entities/cast-crew.entity';

describe('ContentService', () => {
  let service: ContentService;
  let contentRepository: Repository<Content>;
  let seasonRepository: Repository<Season>;
  let genreRepository: Repository<Genre>;

  const mockContent = {
    id: '123',
    title: 'Test Movie',
    type: ContentType.MOVIE,
    status: ContentStatus.PUBLISHED,
    rating: 4.5,
    genres: [],
    tags: [],
    castCrew: [],
    seasons: [],
  };

  const mockContentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[mockContent], 1]),
    })),
  };

  const mockSeasonRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockEpisodeRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockGenreRepository = {
    findBy: jest.fn(),
  };

  const mockTagRepository = {
    findBy: jest.fn(),
  };

  const mockCastCrewRepository = {
    findBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        {
          provide: getRepositoryToken(Content),
          useValue: mockContentRepository,
        },
        {
          provide: getRepositoryToken(Season),
          useValue: mockSeasonRepository,
        },
        {
          provide: getRepositoryToken(Episode),
          useValue: mockEpisodeRepository,
        },
        {
          provide: getRepositoryToken(Genre),
          useValue: mockGenreRepository,
        },
        {
          provide: getRepositoryToken(Tag),
          useValue: mockTagRepository,
        },
        {
          provide: getRepositoryToken(CastCrew),
          useValue: mockCastCrewRepository,
        },
      ],
    }).compile();

    service = module.get<ContentService>(ContentService);
    contentRepository = module.get<Repository<Content>>(
      getRepositoryToken(Content),
    );
    seasonRepository = module.get<Repository<Season>>(
      getRepositoryToken(Season),
    );
    genreRepository = module.get<Repository<Genre>>(getRepositoryToken(Genre));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create content successfully', async () => {
      const createDto = {
        title: 'Test Movie',
        type: ContentType.MOVIE,
        description: 'Test description',
      };

      mockContentRepository.create.mockReturnValue(mockContent);
      mockContentRepository.save.mockResolvedValue(mockContent);

      const result = await service.create(createDto);

      expect(contentRepository.create).toHaveBeenCalled();
      expect(contentRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockContent);
    });

    it('should create content with genres', async () => {
      const createDto = {
        title: 'Test Movie',
        type: ContentType.MOVIE,
        genreIds: ['genre1', 'genre2'],
      };

      const mockGenres = [{ id: 'genre1' }, { id: 'genre2' }];
      mockGenreRepository.findBy.mockResolvedValue(mockGenres);
      mockContentRepository.create.mockReturnValue(mockContent);
      mockContentRepository.save.mockResolvedValue(mockContent);

      await service.create(createDto);

      expect(genreRepository.findBy).toHaveBeenCalledWith({
        id: {
          _type: 'in',
          _value: createDto.genreIds,
          _multipleParameters: true,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated content', async () => {
      const query = { page: 1, limit: 20 };

      const result = await service.findAll(query);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('pagination');
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return content by id', async () => {
      mockContentRepository.findOne.mockResolvedValue(mockContent);

      const result = await service.findOne('123');

      expect(contentRepository.findOne).toHaveBeenCalledWith({
        where: { id: '123' },
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
      expect(result).toEqual(mockContent);
    });

    it('should throw NotFoundException if content not found', async () => {
      mockContentRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update content successfully', async () => {
      const updateDto = { title: 'Updated Title' };
      mockContentRepository.findOne.mockResolvedValue(mockContent);
      mockContentRepository.save.mockResolvedValue({
        ...mockContent,
        ...updateDto,
      });

      const result = await service.update('123', updateDto);

      expect(contentRepository.findOne).toHaveBeenCalled();
      expect(contentRepository.save).toHaveBeenCalled();
      expect(result.title).toBe(updateDto.title);
    });
  });

  describe('remove', () => {
    it('should delete content successfully', async () => {
      mockContentRepository.findOne.mockResolvedValue(mockContent);
      mockContentRepository.remove.mockResolvedValue(mockContent);

      await service.remove('123');

      expect(contentRepository.findOne).toHaveBeenCalled();
      expect(contentRepository.remove).toHaveBeenCalledWith(mockContent);
    });
  });

  describe('addSeason', () => {
    it('should add season to TV show', async () => {
      const tvShow = { ...mockContent, type: ContentType.SHOW };
      const seasonDto = { seasonNumber: 1, title: 'Season 1' };
      const mockSeason = { id: 'season1', ...seasonDto };

      mockContentRepository.findOne.mockResolvedValue(tvShow);
      mockSeasonRepository.create.mockReturnValue(mockSeason);
      mockSeasonRepository.save.mockResolvedValue(mockSeason);

      const result = await service.addSeason('123', seasonDto);

      expect(seasonRepository.create).toHaveBeenCalled();
      expect(seasonRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockSeason);
    });

    it('should throw error when adding season to movie', async () => {
      mockContentRepository.findOne.mockResolvedValue(mockContent);

      await expect(
        service.addSeason('123', { seasonNumber: 1 }),
      ).rejects.toThrow();
    });
  });
});
