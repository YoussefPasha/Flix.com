import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { CastCrewRole } from '../entities/cast-crew.entity';

export class CreateCastCrewDto {
  @ApiProperty({ example: 'Leonardo DiCaprio', description: 'Person name' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    enum: CastCrewRole,
    example: CastCrewRole.ACTOR,
    description: 'Role',
  })
  @IsEnum(CastCrewRole)
  role: CastCrewRole;

  @ApiPropertyOptional({
    example: 'American actor...',
    description: 'Biography',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/image.jpg',
    description: 'Image URL',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageUrl?: string;

  @ApiPropertyOptional({ example: '1974-11-11', description: 'Birth date' })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({ example: 'American', description: 'Nationality' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nationality?: string;
}
