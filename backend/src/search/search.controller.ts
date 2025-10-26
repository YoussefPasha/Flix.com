import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search-query.dto';
import { AutocompleteQueryDto } from './dto/autocomplete-query.dto';

@ApiTags('Search')
@Controller('v1/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search content with filters' })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully',
  })
  search(@Query() searchQueryDto: SearchQueryDto) {
    return this.searchService.search(searchQueryDto);
  }

  @Get('autocomplete')
  @ApiOperation({ summary: 'Autocomplete search suggestions' })
  @ApiResponse({
    status: 200,
    description: 'Autocomplete results retrieved successfully',
  })
  autocomplete(@Query() autocompleteQueryDto: AutocompleteQueryDto) {
    return this.searchService.autocomplete(autocompleteQueryDto);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular content' })
  @ApiResponse({
    status: 200,
    description: 'Popular content retrieved successfully',
  })
  getPopular() {
    return this.searchService.getPopular();
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending content' })
  @ApiResponse({
    status: 200,
    description: 'Trending content retrieved successfully',
  })
  getTrending() {
    return this.searchService.getTrending();
  }
}
