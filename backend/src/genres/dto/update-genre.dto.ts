import { PartialType } from '@nestjs/swagger';
import { CreateGenreDto } from './create-genre.dto';

// Slug is auto-generated and cannot be updated by users
export class UpdateGenreDto extends PartialType(CreateGenreDto) {}
