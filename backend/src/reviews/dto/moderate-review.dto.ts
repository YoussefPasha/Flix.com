import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ReviewStatus } from '../entities/review.entity';

export class ModerateReviewDto {
  @ApiProperty({
    enum: ReviewStatus,
    example: ReviewStatus.APPROVED,
    description: 'Review status',
  })
  @IsEnum(ReviewStatus)
  status: ReviewStatus;
}
