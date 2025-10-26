import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { Genre } from './entities/genre.entity';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>,
  ) {}

  private generateSlug(name: string): string {
    return slugify(name, { lower: true, strict: true });
  }

  async create(createGenreDto: CreateGenreDto): Promise<Genre> {
    const slug = this.generateSlug(createGenreDto.name);

    const existingSlug = await this.genreRepository.findOne({
      where: { slug },
    });

    if (existingSlug) {
      throw new ConflictException(`Genre with slug '${slug}' already exists`);
    }

    const genre = this.genreRepository.create({
      ...createGenreDto,
      slug,
    });
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

    // If name is being updated, regenerate slug
    if (updateGenreDto.name && updateGenreDto.name !== genre.name) {
      const newSlug = this.generateSlug(updateGenreDto.name);

      if (newSlug !== genre.slug) {
        const existingSlug = await this.genreRepository.findOne({
          where: { slug: newSlug },
        });

        if (existingSlug) {
          throw new ConflictException(
            `Genre with slug '${newSlug}' already exists`,
          );
        }

        genre.slug = newSlug;
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
