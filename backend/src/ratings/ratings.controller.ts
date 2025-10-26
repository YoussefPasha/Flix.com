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
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@ApiTags('Ratings')
@Controller('v1/content')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post(':contentId/ratings')
  @ApiOperation({ summary: 'Rate content' })
  @ApiParam({ name: 'contentId', description: 'Content ID' })
  @ApiResponse({ status: 201, description: 'Rating created successfully' })
  @ApiResponse({
    status: 409,
    description: 'User has already rated this content',
  })
  create(
    @Param('contentId', ParseUUIDPipe) contentId: string,
    @Body() createRatingDto: CreateRatingDto,
  ) {
    return this.ratingsService.create({ ...createRatingDto, contentId });
  }

  @Get(':contentId/ratings')
  @ApiOperation({ summary: 'Get content ratings' })
  @ApiParam({ name: 'contentId', description: 'Content ID' })
  @ApiResponse({ status: 200, description: 'Ratings retrieved successfully' })
  findByContent(@Param('contentId', ParseUUIDPipe) contentId: string) {
    return this.ratingsService.findByContent(contentId);
  }

  @Get(':contentId/ratings/aggregate')
  @ApiOperation({ summary: 'Get aggregate rating for content' })
  @ApiParam({ name: 'contentId', description: 'Content ID' })
  @ApiResponse({
    status: 200,
    description: 'Aggregate rating retrieved successfully',
  })
  getAggregate(@Param('contentId', ParseUUIDPipe) contentId: string) {
    return this.ratingsService.getAggregateRating(contentId);
  }

  @Patch('ratings/:id')
  @ApiOperation({ summary: 'Update rating' })
  @ApiParam({ name: 'id', description: 'Rating ID' })
  @ApiResponse({ status: 200, description: 'Rating updated successfully' })
  @ApiResponse({ status: 404, description: 'Rating not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRatingDto: UpdateRatingDto & { userId: string },
  ) {
    const { userId, ...dto } = updateRatingDto;
    return this.ratingsService.update(id, userId, dto);
  }

  @Delete('ratings/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete rating' })
  @ApiParam({ name: 'id', description: 'Rating ID' })
  @ApiResponse({ status: 204, description: 'Rating deleted successfully' })
  @ApiResponse({ status: 404, description: 'Rating not found' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('userId') userId: string,
  ) {
    return this.ratingsService.remove(id, userId);
  }
}
