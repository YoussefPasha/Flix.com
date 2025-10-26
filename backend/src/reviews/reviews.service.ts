import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review, ReviewStatus } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ModerateReviewDto } from './dto/moderate-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const review = this.reviewRepository.create(createReviewDto);
    return this.reviewRepository.save(review);
  }

  async findByContent(
    contentId: string,
    status?: ReviewStatus,
  ): Promise<Review[]> {
    const where: Record<string, unknown> = { contentId };
    if (status) {
      where.status = status;
    }

    return this.reviewRepository.find({
      where,
      order: { createdAt: 'DESC' },
      relations: ['rating'],
    });
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['rating', 'content'],
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  async update(
    id: string,
    userId: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id, userId },
    });

    if (!review) {
      throw new NotFoundException('Review not found or unauthorized');
    }

    Object.assign(review, updateReviewDto);
    review.isModerated = false;
    review.status = ReviewStatus.PENDING;

    return this.reviewRepository.save(review);
  }

  async remove(id: string, userId: string): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { id, userId },
    });

    if (!review) {
      throw new NotFoundException('Review not found or unauthorized');
    }

    await this.reviewRepository.remove(review);
  }

  async likeReview(id: string): Promise<Review> {
    const review = await this.findOne(id);
    review.likes += 1;
    return this.reviewRepository.save(review);
  }

  async dislikeReview(id: string): Promise<Review> {
    const review = await this.findOne(id);
    review.dislikes += 1;
    return this.reviewRepository.save(review);
  }

  async moderate(
    id: string,
    moderateReviewDto: ModerateReviewDto,
  ): Promise<Review> {
    const review = await this.findOne(id);

    review.status = moderateReviewDto.status;
    review.isModerated = true;

    return this.reviewRepository.save(review);
  }

  async getPendingReviews(): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { status: ReviewStatus.PENDING },
      order: { createdAt: 'ASC' },
      relations: ['content'],
    });
  }
}
