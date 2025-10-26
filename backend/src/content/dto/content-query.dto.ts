import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  IsString,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ContentType, ContentStatus } from '../entities/content.entity';

export class ContentQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, description: 'Items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional({
    enum: ContentType,
    description: 'Filter by content type',
  })
  @IsOptional()
  @IsEnum(ContentType)
  type?: ContentType;

  @ApiPropertyOptional({ enum: ContentStatus, description: 'Filter by status' })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Filter by genre ID',
  })
  @IsOptional()
  @IsUUID('4')
  genreId?: string;

  @ApiPropertyOptional({ example: 'inception', description: 'Search by title' })
  @IsOptional()
  @IsString()
  search?: string;
}
