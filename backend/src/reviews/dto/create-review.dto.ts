import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'User ID',
  })
  @IsUUID('4')
  userId: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'Content ID',
  })
  @IsUUID('4')
  contentId: string;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440002',
    description: 'Rating ID',
  })
  @IsOptional()
  @IsUUID('4')
  ratingId?: string;

  @ApiProperty({
    example: 'This was an amazing movie!',
    description: 'Review text',
  })
  @IsString()
  reviewText: string;
}
