import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsInt,
  IsArray,
  IsUUID,
  Min,
  MaxLength,
} from 'class-validator';
import { ContentType, ContentStatus } from '../entities/content.entity';

export class CreateContentDto {
  @ApiProperty({ example: 'Inception', description: 'Content title' })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    example: 'A mind-bending thriller...',
    description: 'Content description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '2023-07-15', description: 'Release date' })
  @IsOptional()
  @IsDateString()
  releaseDate?: string;

  @ApiPropertyOptional({ example: 148, description: 'Duration in minutes' })
  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;

  @ApiProperty({
    enum: ContentType,
    example: ContentType.MOVIE,
    description: 'Content type',
  })
  @IsEnum(ContentType)
  type: ContentType;

  @ApiPropertyOptional({
    example: 'https://example.com/thumbnail.jpg',
    description: 'Thumbnail URL',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  thumbnailUrl?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/trailer.mp4',
    description: 'Trailer URL',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  trailerUrl?: string;

  @ApiPropertyOptional({
    enum: ContentStatus,
    example: ContentStatus.DRAFT,
    description: 'Content status',
  })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @ApiPropertyOptional({
    example: ['550e8400-e29b-41d4-a716-446655440000'],
    description: 'Genre IDs',
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  genreIds?: string[];

  @ApiPropertyOptional({
    example: ['550e8400-e29b-41d4-a716-446655440001'],
    description: 'Tag IDs',
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tagIds?: string[];

  @ApiPropertyOptional({
    example: ['550e8400-e29b-41d4-a716-446655440002'],
    description: 'Cast & Crew IDs',
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  castCrewIds?: string[];
}
