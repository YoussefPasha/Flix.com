import { PartialType } from '@nestjs/swagger';
import { CreateTagDto } from './create-tag.dto';

// Slug is auto-generated and cannot be updated by users
export class UpdateTagDto extends PartialType(CreateTagDto) {}
