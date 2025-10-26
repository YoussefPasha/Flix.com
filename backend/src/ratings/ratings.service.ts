import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { Content } from '../content/entities/content.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
  ) {}

  async create(createRatingDto: CreateRatingDto): Promise<Rating> {
    // Check if user already rated this content
    const existingRating = await this.ratingRepository.findOne({
      where: {
        userId: createRatingDto.userId,
        contentId: createRatingDto.contentId,
      },
    });

    if (existingRating) {
      throw new ConflictException('User has already rated this content');
    }

    const rating = this.ratingRepository.create(createRatingDto);
    const savedRating = await this.ratingRepository.save(rating);

    // Update content aggregate rating
    await this.updateContentRating(createRatingDto.contentId);

    return savedRating;
  }

  async findByContent(contentId: string): Promise<Rating[]> {
    return this.ratingRepository.find({
      where: { contentId },
      order: { createdAt: 'DESC' },
    });
  }

  async getAggregateRating(contentId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.ratingRepository
      .createQueryBuilder('rating')
      .select('AVG(rating.score)', 'average')
      .addSelect('COUNT(rating.id)', 'count')
      .where('rating.contentId = :contentId', { contentId })
      .getRawOne();

    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      averageRating: parseFloat(String(result?.average || 0)),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      totalRatings: parseInt(String(result?.count || 0), 10),
    };
  }

  async update(
    id: string,
    userId: string,
    updateRatingDto: UpdateRatingDto,
  ): Promise<Rating> {
    const rating = await this.ratingRepository.findOne({
      where: { id, userId },
    });

    if (!rating) {
      throw new NotFoundException('Rating not found or unauthorized');
    }

    Object.assign(rating, updateRatingDto);
    const updatedRating = await this.ratingRepository.save(rating);

    // Update content aggregate rating
    await this.updateContentRating(rating.contentId);

    return updatedRating;
  }

  async remove(id: string, userId: string): Promise<void> {
    const rating = await this.ratingRepository.findOne({
      where: { id, userId },
    });

    if (!rating) {
      throw new NotFoundException('Rating not found or unauthorized');
    }

    const contentId = rating.contentId;
    await this.ratingRepository.remove(rating);

    // Update content aggregate rating
    await this.updateContentRating(contentId);
  }

  private async updateContentRating(contentId: string): Promise<void> {
    const aggregate = await this.getAggregateRating(contentId);

    await this.contentRepository.update(contentId, {
      rating: aggregate.averageRating,
      ratingCount: aggregate.totalRatings,
    });
  }
}
