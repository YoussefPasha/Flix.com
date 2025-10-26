import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content, ContentStatus } from '../content/entities/content.entity';
import { Genre } from '../genres/entities/genre.entity';
import { SearchQueryDto, SortField } from './dto/search-query.dto';
import { AutocompleteQueryDto } from './dto/autocomplete-query.dto';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>,
  ) {}

  async search(searchQueryDto: SearchQueryDto) {
    const {
      q,
      type,
      genre,
      year,
      minRating,
      maxRating,
      sort,
      order,
      page = 1,
      limit = 20,
    } = searchQueryDto;

    const skip = (page - 1) * limit;

    const queryBuilder = this.contentRepository
      .createQueryBuilder('content')
      .leftJoinAndSelect('content.genres', 'genre')
      .leftJoinAndSelect('content.tags', 'tag')
      .where('content.status = :status', { status: ContentStatus.PUBLISHED });

    // Full-text search on title and description
    if (q) {
      queryBuilder.andWhere(
        '(content.title ILIKE :query OR content.description ILIKE :query)',
        { query: `%${q}%` },
      );
    }

    if (type) {
      queryBuilder.andWhere('content.type = :type', { type });
    }

    if (genre) {
      const genreEntity = await this.genreRepository.findOne({
        where: { slug: genre },
      });

      if (genreEntity) {
        queryBuilder.andWhere('genre.id = :genreId', {
          genreId: genreEntity.id,
        });
      }
    }

    if (year) {
      queryBuilder.andWhere('EXTRACT(YEAR FROM content.releaseDate) = :year', {
        year,
      });
    }

    if (minRating !== undefined) {
      queryBuilder.andWhere('content.rating >= :minRating', { minRating });
    }

    if (maxRating !== undefined) {
      queryBuilder.andWhere('content.rating <= :maxRating', { maxRating });
    }

    // Sorting
    const sortOrder = (order || 'desc').toUpperCase() as 'ASC' | 'DESC';

    switch (sort) {
      case SortField.DATE:
        queryBuilder.orderBy('content.releaseDate', sortOrder);
        break;
      case SortField.RATING:
        queryBuilder.orderBy('content.rating', sortOrder);
        break;
      case SortField.TITLE:
        queryBuilder.orderBy('content.title', sortOrder);
        break;
      case SortField.RELEVANCE:
      default:
        // For relevance, prioritize by view count and rating
        queryBuilder
          .orderBy('content.viewCount', 'DESC')
          .addOrderBy('content.rating', 'DESC');
        break;
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async autocomplete(autocompleteQueryDto: AutocompleteQueryDto) {
    const { q } = autocompleteQueryDto;

    const results = await this.contentRepository
      .createQueryBuilder('content')
      .select([
        'content.id',
        'content.title',
        'content.type',
        'content.thumbnailUrl',
      ])
      .where('content.title ILIKE :query', { query: `${q}%` })
      .andWhere('content.status = :status', { status: ContentStatus.PUBLISHED })
      .orderBy('content.viewCount', 'DESC')
      .take(10)
      .getMany();

    return results;
  }

  async getPopular(limit: number = 10) {
    return this.contentRepository.find({
      where: { status: ContentStatus.PUBLISHED },
      order: { viewCount: 'DESC', rating: 'DESC' },
      take: limit,
      relations: ['genres', 'tags'],
    });
  }

  async getTrending(limit: number = 10) {
    // Get content from the last 30 days ordered by views
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return this.contentRepository
      .createQueryBuilder('content')
      .leftJoinAndSelect('content.genres', 'genre')
      .leftJoinAndSelect('content.tags', 'tag')
      .where('content.status = :status', { status: ContentStatus.PUBLISHED })
      .andWhere('content.createdAt >= :date', { date: thirtyDaysAgo })
      .orderBy('content.viewCount', 'DESC')
      .addOrderBy('content.rating', 'DESC')
      .take(limit)
      .getMany();
  }
}
