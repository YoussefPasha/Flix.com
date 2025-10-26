import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsDateString,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateSeasonDto {
  @ApiProperty({ example: 1, description: 'Season number' })
  @IsInt()
  seasonNumber: number;

  @ApiPropertyOptional({ example: 'Season 1', description: 'Season title' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    example: 'The beginning',
    description: 'Season description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '2023-09-01', description: 'Release date' })
  @IsOptional()
  @IsDateString()
  releaseDate?: string;
}
