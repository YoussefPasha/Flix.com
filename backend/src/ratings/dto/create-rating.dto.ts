import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, Min, Max } from 'class-validator';

export class CreateRatingDto {
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

  @ApiProperty({ example: 4.5, description: 'Rating score (1.0 to 5.0)' })
  @IsNumber()
  @Min(1.0)
  @Max(5.0)
  score: number;
}
