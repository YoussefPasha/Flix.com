import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, MaxLength } from 'class-validator';

export class CreateGenreDto {
  @ApiProperty({ example: 'Action', description: 'Genre name' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'action', description: 'Genre slug' })
  @IsString()
  @MaxLength(100)
  slug: string;

  @ApiPropertyOptional({
    example: 'High-energy action films',
    description: 'Genre description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Parent genre ID',
  })
  @IsOptional()
  @IsUUID('4')
  parentId?: string;
}
