import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class AutocompleteQueryDto {
  @ApiProperty({
    example: 'incep',
    description: 'Search query (minimum 2 characters)',
  })
  @IsString()
  @MinLength(2)
  q: string;
}
