import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  private generateSlug(name: string): string {
    return slugify(name, { lower: true, strict: true });
  }

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const slug = this.generateSlug(createTagDto.name);

    const existingSlug = await this.tagRepository.findOne({
      where: { slug },
    });

    if (existingSlug) {
      throw new ConflictException(`Tag with slug '${slug}' already exists`);
    }

    const tag = this.tagRepository.create({
      ...createTagDto,
      slug,
    });
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

    // If name is being updated, regenerate slug
    if (updateTagDto.name && updateTagDto.name !== tag.name) {
      const newSlug = this.generateSlug(updateTagDto.name);

      if (newSlug !== tag.slug) {
        const existingSlug = await this.tagRepository.findOne({
          where: { slug: newSlug },
        });

        if (existingSlug) {
          throw new ConflictException(
            `Tag with slug '${newSlug}' already exists`,
          );
        }

        tag.slug = newSlug;
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
