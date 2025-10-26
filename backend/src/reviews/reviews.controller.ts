import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ModerateReviewDto } from './dto/moderate-review.dto';
import { ReviewStatus } from './entities/review.entity';

@ApiTags('Reviews')
@Controller('v1')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('content/:contentId/reviews')
  @ApiOperation({ summary: 'Create review for content' })
  @ApiParam({ name: 'contentId', description: 'Content ID' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  create(
    @Param('contentId', ParseUUIDPipe) contentId: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.create({ ...createReviewDto, contentId });
  }

  @Get('content/:contentId/reviews')
  @ApiOperation({ summary: 'Get reviews for content' })
  @ApiParam({ name: 'contentId', description: 'Content ID' })
  @ApiQuery({ name: 'status', enum: ReviewStatus, required: false })
  @ApiResponse({ status: 200, description: 'Reviews retrieved successfully' })
  findByContent(
    @Param('contentId', ParseUUIDPipe) contentId: string,
    @Query('status') status?: ReviewStatus,
  ) {
    return this.reviewsService.findByContent(contentId, status);
  }

  @Get('reviews/:id')
  @ApiOperation({ summary: 'Get review by ID' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiResponse({ status: 200, description: 'Review retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch('reviews/:id')
  @ApiOperation({ summary: 'Update review' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiResponse({ status: 200, description: 'Review updated successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReviewDto: UpdateReviewDto & { userId: string },
  ) {
    const { userId, ...dto } = updateReviewDto;
    return this.reviewsService.update(id, userId, dto);
  }

  @Delete('reviews/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete review' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiResponse({ status: 204, description: 'Review deleted successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('userId') userId: string,
  ) {
    return this.reviewsService.remove(id, userId);
  }

  @Post('reviews/:id/like')
  @ApiOperation({ summary: 'Like a review' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiResponse({ status: 200, description: 'Review liked successfully' })
  likeReview(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.likeReview(id);
  }

  @Post('reviews/:id/dislike')
  @ApiOperation({ summary: 'Dislike a review' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiResponse({ status: 200, description: 'Review disliked successfully' })
  dislikeReview(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.dislikeReview(id);
  }

  // Admin endpoints
  @Post('admin/reviews/:id/moderate')
  @ApiOperation({ summary: 'Moderate review (Admin)' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiResponse({ status: 200, description: 'Review moderated successfully' })
  moderateReview(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() moderateReviewDto: ModerateReviewDto,
  ) {
    return this.reviewsService.moderate(id, moderateReviewDto);
  }

  @Get('admin/reviews/pending')
  @ApiOperation({ summary: 'Get pending reviews for moderation (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Pending reviews retrieved successfully',
  })
  getPendingReviews() {
    return this.reviewsService.getPendingReviews();
  }
}
