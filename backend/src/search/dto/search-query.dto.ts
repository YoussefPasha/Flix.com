import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  Min,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ContentType } from '../../content/entities/content.entity';

export enum SortField {
  RELEVANCE = 'relevance',
  DATE = 'date',
  RATING = 'rating',
  TITLE = 'title',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class SearchQueryDto {
  @ApiPropertyOptional({ example: 'inception', description: 'Search query' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    enum: ContentType,
    description: 'Filter by content type',
  })
  @IsOptional()
  @IsEnum(ContentType)
  type?: ContentType;

  @ApiPropertyOptional({
    example: 'action',
    description: 'Filter by genre slug',
  })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiPropertyOptional({ example: 2023, description: 'Filter by release year' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  year?: number;

  @ApiPropertyOptional({ example: 4.0, description: 'Minimum rating' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minRating?: number;

  @ApiPropertyOptional({ example: 5.0, description: 'Maximum rating' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxRating?: number;

  @ApiPropertyOptional({
    enum: SortField,
    example: SortField.RELEVANCE,
    description: 'Sort field',
  })
  @IsOptional()
  @IsEnum(SortField)
  sort?: SortField = SortField.RELEVANCE;

  @ApiPropertyOptional({
    enum: SortOrder,
    example: SortOrder.DESC,
    description: 'Sort order',
  })
  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder = SortOrder.DESC;

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
}
