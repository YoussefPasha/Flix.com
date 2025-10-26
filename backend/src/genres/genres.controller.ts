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
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@ApiTags('Genres')
@Controller('v1/admin/genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post()
  @ApiOperation({ summary: 'Create new genre' })
  @ApiResponse({ status: 201, description: 'Genre created successfully' })
  @ApiResponse({ status: 409, description: 'Genre with slug already exists' })
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.genresService.create(createGenreDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all genres' })
  @ApiResponse({ status: 200, description: 'Genres retrieved successfully' })
  findAll() {
    return this.genresService.findAll();
  }

  @Get('tree')
  @ApiOperation({ summary: 'Get genre tree (hierarchical)' })
  @ApiResponse({
    status: 200,
    description: 'Genre tree retrieved successfully',
  })
  getTree() {
    return this.genresService.getGenreTree();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get genre by ID' })
  @ApiParam({ name: 'id', description: 'Genre ID' })
  @ApiResponse({ status: 200, description: 'Genre retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Genre not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.genresService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get genre by slug' })
  @ApiParam({ name: 'slug', description: 'Genre slug' })
  @ApiResponse({ status: 200, description: 'Genre retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Genre not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.genresService.findBySlug(slug);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update genre' })
  @ApiParam({ name: 'id', description: 'Genre ID' })
  @ApiResponse({ status: 200, description: 'Genre updated successfully' })
  @ApiResponse({ status: 404, description: 'Genre not found' })
  @ApiResponse({ status: 409, description: 'Genre with slug already exists' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGenreDto: UpdateGenreDto,
  ) {
    return this.genresService.update(id, updateGenreDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete genre' })
  @ApiParam({ name: 'id', description: 'Genre ID' })
  @ApiResponse({ status: 204, description: 'Genre deleted successfully' })
  @ApiResponse({ status: 404, description: 'Genre not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.genresService.remove(id);
  }
}
