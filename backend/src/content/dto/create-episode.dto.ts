import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsString,
  IsOptional,
  IsDateString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateEpisodeDto {
  @ApiProperty({ example: 1, description: 'Episode number' })
  @IsInt()
  @Min(1)
  episodeNumber: number;

  @ApiProperty({ example: 'Pilot', description: 'Episode title' })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    example: 'The story begins...',
    description: 'Episode description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 45, description: 'Duration in minutes' })
  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;

  @ApiPropertyOptional({
    example: 'https://example.com/video.mp4',
    description: 'Video URL',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  videoUrl?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/thumb.jpg',
    description: 'Thumbnail URL',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  thumbnailUrl?: string;

  @ApiPropertyOptional({ example: '2023-09-01', description: 'Release date' })
  @IsOptional()
  @IsDateString()
  releaseDate?: string;
}
