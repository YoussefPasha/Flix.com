import { PartialType } from '@nestjs/swagger';
import { CreateCastCrewDto } from './create-cast-crew.dto';

export class UpdateCastCrewDto extends PartialType(CreateCastCrewDto) {}
