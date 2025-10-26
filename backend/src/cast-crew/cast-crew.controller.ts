import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CastCrewService } from './cast-crew.service';
import { CreateCastCrewDto } from './dto/create-cast-crew.dto';
import { UpdateCastCrewDto } from './dto/update-cast-crew.dto';

@ApiTags('Cast & Crew')
@Controller('v1/admin/cast-crew')
export class CastCrewController {
  constructor(private readonly castCrewService: CastCrewService) {}

  @Post()
  @ApiOperation({ summary: 'Create new cast/crew member' })
  @ApiResponse({ status: 201, description: 'Cast/Crew created successfully' })
  create(@Body() createCastCrewDto: CreateCastCrewDto) {
    return this.castCrewService.create(createCastCrewDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cast/crew members' })
  @ApiResponse({
    status: 200,
    description: 'Cast/Crew list retrieved successfully',
  })
  findAll() {
    return this.castCrewService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get cast/crew member by ID' })
  @ApiParam({ name: 'id', description: 'Cast/Crew ID' })
  @ApiResponse({ status: 200, description: 'Cast/Crew retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Cast/Crew not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.castCrewService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update cast/crew member' })
  @ApiParam({ name: 'id', description: 'Cast/Crew ID' })
  @ApiResponse({ status: 200, description: 'Cast/Crew updated successfully' })
  @ApiResponse({ status: 404, description: 'Cast/Crew not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCastCrewDto: UpdateCastCrewDto,
  ) {
    return this.castCrewService.update(id, updateCastCrewDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete cast/crew member' })
  @ApiParam({ name: 'id', description: 'Cast/Crew ID' })
  @ApiResponse({ status: 204, description: 'Cast/Crew deleted successfully' })
  @ApiResponse({ status: 404, description: 'Cast/Crew not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.castCrewService.remove(id);
  }
}
