import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const existingSlug = await this.tagRepository.findOne({
      where: { slug: createTagDto.slug },
    });

    if (existingSlug) {
      throw new ConflictException(
        `Tag with slug '${createTagDto.slug}' already exists`,
      );
    }

    const tag = this.tagRepository.create(createTagDto);
    return this.tagRepository.save(tag);
  }

  async findAll(): Promise<Tag[]> {
    return this.tagRepository.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { id },
      relations: ['contents'],
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    return tag;
  }

  async update(id: string, updateTagDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.findOne(id);

    if (updateTagDto.slug && updateTagDto.slug !== tag.slug) {
      const existingSlug = await this.tagRepository.findOne({
        where: { slug: updateTagDto.slug },
      });

      if (existingSlug) {
        throw new ConflictException(
          `Tag with slug '${updateTagDto.slug}' already exists`,
        );
      }
    }

    Object.assign(tag, updateTagDto);
    return this.tagRepository.save(tag);
  }

  async remove(id: string): Promise<void> {
    const tag = await this.findOne(id);
    await this.tagRepository.remove(tag);
  }
}
