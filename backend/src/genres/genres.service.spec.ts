/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { GenresService } from './genres.service';
import { Genre } from './entities/genre.entity';

describe('GenresService', () => {
  let service: GenresService;
  let repository: Repository<Genre>;

  const mockGenre = {
    id: '123',
    name: 'Action',
    slug: 'action',
    description: 'Action movies',
    parent: null,
    children: [],
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenresService,
        {
          provide: getRepositoryToken(Genre),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<GenresService>(GenresService);
    repository = module.get<Repository<Genre>>(getRepositoryToken(Genre));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a genre successfully', async () => {
      const createDto = {
        name: 'Action',
        slug: 'action',
        description: 'Action movies',
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockGenre);
      mockRepository.save.mockResolvedValue(mockGenre);

      const result = await service.create(createDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { slug: createDto.slug },
      });
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(mockGenre);
    });

    it('should throw ConflictException if slug already exists', async () => {
      const createDto = {
        name: 'Action',
        slug: 'action',
      };

      mockRepository.findOne.mockResolvedValue(mockGenre);

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all genres', async () => {
      const genres = [mockGenre];
      mockRepository.find.mockResolvedValue(genres);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        relations: ['parent', 'children'],
        order: { name: 'ASC' },
      });
      expect(result).toEqual(genres);
    });
  });

  describe('findOne', () => {
    it('should return a genre by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockGenre);

      const result = await service.findOne('123');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '123' },
        relations: ['parent', 'children', 'contents'],
      });
      expect(result).toEqual(mockGenre);
    });

    it('should throw NotFoundException if genre not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findBySlug', () => {
    it('should return a genre by slug', async () => {
      mockRepository.findOne.mockResolvedValue(mockGenre);

      const result = await service.findBySlug('action');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { slug: 'action' },
        relations: ['parent', 'children', 'contents'],
      });
      expect(result).toEqual(mockGenre);
    });

    it('should throw NotFoundException if genre not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findBySlug('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a genre successfully', async () => {
      const updateDto = { name: 'Updated Action' };
      mockRepository.findOne.mockResolvedValue(mockGenre);
      mockRepository.save.mockResolvedValue({
        ...mockGenre,
        ...updateDto,
      });

      const result = await service.update('123', updateDto);

      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
      expect(result.name).toBe(updateDto.name);
    });

    it('should throw ConflictException if new slug already exists', async () => {
      const updateDto = { slug: 'comedy' };
      mockRepository.findOne
        .mockResolvedValueOnce(mockGenre)
        .mockResolvedValueOnce({ id: '456', slug: 'comedy' });

      await expect(service.update('123', updateDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a genre successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockGenre);
      mockRepository.remove.mockResolvedValue(mockGenre);

      await service.remove('123');

      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.remove).toHaveBeenCalledWith(mockGenre);
    });
  });

  describe('getGenreTree', () => {
    it('should return genre hierarchy', async () => {
      const genres = [mockGenre];
      mockRepository.find.mockResolvedValue(genres);

      const result = await service.getGenreTree();

      expect(repository.find).toHaveBeenCalledWith({
        where: { parentId: null },
        relations: ['children', 'children.children'],
        order: { name: 'ASC' },
      });
      expect(result).toEqual(genres);
    });
  });
});
