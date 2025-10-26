import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ example: 'Blockbuster', description: 'Tag name' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'blockbuster', description: 'Tag slug' })
  @IsString()
  @MaxLength(100)
  slug: string;

  @ApiPropertyOptional({
    example: 'High-grossing content',
    description: 'Tag description',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
