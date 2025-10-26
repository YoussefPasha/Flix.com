import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from './entities/genre.entity';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>,
  ) {}

  async create(createGenreDto: CreateGenreDto): Promise<Genre> {
    const existingSlug = await this.genreRepository.findOne({
      where: { slug: createGenreDto.slug },
    });

    if (existingSlug) {
      throw new ConflictException(
        `Genre with slug '${createGenreDto.slug}' already exists`,
      );
    }

    const genre = this.genreRepository.create(createGenreDto);
    return this.genreRepository.save(genre);
  }

  async findAll(): Promise<Genre[]> {
    return this.genreRepository.find({
      relations: ['parent', 'children'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Genre> {
    const genre = await this.genreRepository.findOne({
      where: { id },
      relations: ['parent', 'children', 'contents'],
    });

    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }

    return genre;
  }

  async findBySlug(slug: string): Promise<Genre> {
    const genre = await this.genreRepository.findOne({
      where: { slug },
      relations: ['parent', 'children', 'contents'],
    });

    if (!genre) {
      throw new NotFoundException(`Genre with slug '${slug}' not found`);
    }

    return genre;
  }

  async update(id: string, updateGenreDto: UpdateGenreDto): Promise<Genre> {
    const genre = await this.findOne(id);

    if (updateGenreDto.slug && updateGenreDto.slug !== genre.slug) {
      const existingSlug = await this.genreRepository.findOne({
        where: { slug: updateGenreDto.slug },
      });

      if (existingSlug) {
        throw new ConflictException(
          `Genre with slug '${updateGenreDto.slug}' already exists`,
        );
      }
    }

    Object.assign(genre, updateGenreDto);
    return this.genreRepository.save(genre);
  }

  async remove(id: string): Promise<void> {
    const genre = await this.findOne(id);
    await this.genreRepository.remove(genre);
  }

  async getGenreTree(): Promise<Genre[]> {
    // Get all top-level genres (no parent)
    return this.genreRepository.find({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where: { parentId: null as any },
      relations: ['children', 'children.children'],
      order: { name: 'ASC' },
    });
  }
}
