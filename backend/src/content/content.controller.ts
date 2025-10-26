import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ContentQueryDto } from './dto/content-query.dto';
import { CreateSeasonDto } from './dto/create-season.dto';
import { CreateEpisodeDto } from './dto/create-episode.dto';

@ApiTags('Content')
@Controller('v1/admin/content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @ApiOperation({ summary: 'Create new content' })
  @ApiResponse({ status: 201, description: 'Content created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createContentDto: CreateContentDto) {
    return this.contentService.create(createContentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all content with pagination and filters' })
  @ApiResponse({
    status: 200,
    description: 'Content list retrieved successfully',
  })
  findAll(@Query() query: ContentQueryDto) {
    return this.contentService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get content by ID' })
  @ApiParam({ name: 'id', description: 'Content ID' })
  @ApiResponse({ status: 200, description: 'Content retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.contentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update content' })
  @ApiParam({ name: 'id', description: 'Content ID' })
  @ApiResponse({ status: 200, description: 'Content updated successfully' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateContentDto: UpdateContentDto,
  ) {
    return this.contentService.update(id, updateContentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete content' })
  @ApiParam({ name: 'id', description: 'Content ID' })
  @ApiResponse({ status: 204, description: 'Content deleted successfully' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.contentService.remove(id);
  }

  // Season management
  @Post(':id/seasons')
  @ApiOperation({ summary: 'Add season to TV show' })
  @ApiParam({ name: 'id', description: 'Content ID' })
  @ApiResponse({ status: 201, description: 'Season added successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - not a TV show' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  addSeason(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createSeasonDto: CreateSeasonDto,
  ) {
    return this.contentService.addSeason(id, createSeasonDto);
  }

  @Get(':id/seasons')
  @ApiOperation({ summary: 'Get all seasons for content' })
  @ApiParam({ name: 'id', description: 'Content ID' })
  @ApiResponse({ status: 200, description: 'Seasons retrieved successfully' })
  getSeasons(@Param('id', ParseUUIDPipe) id: string) {
    return this.contentService.getSeasons(id);
  }

  // Episode management
  @Post(':id/seasons/:seasonId/episodes')
  @ApiOperation({ summary: 'Add episode to season' })
  @ApiParam({ name: 'id', description: 'Content ID' })
  @ApiParam({ name: 'seasonId', description: 'Season ID' })
  @ApiResponse({ status: 201, description: 'Episode added successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - not a TV show' })
  @ApiResponse({ status: 404, description: 'Content or season not found' })
  addEpisode(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('seasonId', ParseUUIDPipe) seasonId: string,
    @Body() createEpisodeDto: CreateEpisodeDto,
  ) {
    return this.contentService.addEpisode(id, seasonId, createEpisodeDto);
  }

  @Get(':id/seasons/:seasonId/episodes')
  @ApiOperation({ summary: 'Get all episodes for season' })
  @ApiParam({ name: 'id', description: 'Content ID' })
  @ApiParam({ name: 'seasonId', description: 'Season ID' })
  @ApiResponse({ status: 200, description: 'Episodes retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Season not found' })
  getEpisodes(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('seasonId', ParseUUIDPipe) seasonId: string,
  ) {
    return this.contentService.getEpisodes(id, seasonId);
  }
}
