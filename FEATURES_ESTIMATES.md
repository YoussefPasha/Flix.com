# Content Management System Implementation

## Overview

Build a comprehensive CMS for managing movies, TV shows, and related metadata including genres, cast/crew, ratings, and reviews. This includes database design, admin APIs, search functionality, and content categorization.

## Technology Stack

- NestJS with TypeORM for database management
- PostgreSQL for relational data storage
- class-validator for input validation
- Swagger for API documentation

## Implementation Steps

### Task 3.1: Design Database Schema for Movies/Shows (8-10 hours)

**Dependencies to Install:**

- `@nestjs/typeorm`, `typeorm`, `pg` (PostgreSQL driver)
- `@nestjs/config` for environment configuration

**Database Entities to Create:**

1. **Content Entity** (`src/content/entities/content.entity.ts`)

   - Base entity for both movies and shows
   - Fields: id, title, description, releaseDate, duration, type (movie/show), rating, thumbnailUrl, trailerUrl, status, createdAt, updatedAt

2. **Season Entity** (`src/content/entities/season.entity.ts`)

   - For TV shows only
   - Fields: id, seasonNumber, contentId (FK), releaseDate

3. **Episode Entity** (`src/content/entities/episode.entity.ts`)

   - Belongs to seasons
   - Fields: id, episodeNumber, title, description, duration, seasonId (FK), videoUrl

4. **Genre Entity** (`src/content/entities/genre.entity.ts`)

   - Fields: id, name, slug, description

5. **ContentGenre Entity** (Many-to-Many junction table)

6. **CastCrew Entity** (`src/content/entities/cast-crew.entity.ts`)

   - Fields: id, name, role (actor/director/producer), bio, imageUrl

7. **ContentCastCrew Entity** (Many-to-Many with role specification)

**Files to Create:**

- Database configuration: `src/config/database.config.ts`
- Migration setup and initial schema migrations
- Database module: `src/database/database.module.ts`

### Task 3.2: Build Admin Dashboard APIs (20-24 hours)

**Modules to Create:**

1. **Content Module** (`src/content/`)

   - Controller: `content.controller.ts`
   - Service: `content.service.ts`
   - DTOs: `create-content.dto.ts`, `update-content.dto.ts`, `content-query.dto.ts`

2. **Genre Module** (`src/genres/`)

   - Full CRUD for genres
   - Controller, Service, DTOs

3. **Cast/Crew Module** (`src/cast-crew/`)

   - Manage actors, directors, producers
   - Controller, Service, DTOs

**Endpoints to Implement:**

```
POST   /api/v1/admin/content           - Create new content
GET    /api/v1/admin/content           - List all content (paginated)
GET    /api/v1/admin/content/:id       - Get content by ID
PATCH  /api/v1/admin/content/:id       - Update content
DELETE /api/v1/admin/content/:id       - Delete content
POST   /api/v1/admin/content/:id/seasons - Add season to show
POST   /api/v1/admin/content/:id/episodes - Add episode to season
POST   /api/v1/admin/content/bulk      - Bulk import content
```

**Features:**

- Input validation with class-validator
- Video metadata storage
- Content scheduling (publish dates)
- Draft/Published status management

### Task 3.3: Implement Content Categorization and Tagging (8-10 hours)

**Enhancements:**

1. **Tag System**

   - Create Tag entity: `src/tags/entities/tag.entity.ts`
   - Many-to-many relationship with Content
   - Tag CRUD endpoints

2. **Category Hierarchy**

   - Extend Genre entity with parent-child relationships
   - Support nested categories (Action > Superhero > Marvel)
   - Category tree endpoints

3. **Content Association Endpoints**
   ```
   POST   /api/v1/admin/content/:id/genres     - Add genres to content
   DELETE /api/v1/admin/content/:id/genres/:genreId - Remove genre
   POST   /api/v1/admin/content/:id/tags       - Add tags
   POST   /api/v1/admin/content/:id/cast       - Add cast/crew
   ```

4. **Advanced Categorization Features**

   - Auto-tagging based on content analysis
   - Genre recommendations for content
   - Batch tagging operations

**Files to Create:**

- `src/tags/tags.module.ts`
- `src/tags/tags.service.ts`
- `src/tags/tags.controller.ts`
- `src/tags/entities/tag.entity.ts`
- `src/tags/dto/create-tag.dto.ts`

### Task 3.4: Create Content Search with Filters (12-16 hours)

**Search Implementation:**

1. **Basic Search Service** (`src/search/search.service.ts`)

   - Full-text search using PostgreSQL's full-text search
   - Search by title, description, cast names
   - Use TypeORM query builder with ILIKE

2. **Advanced Filtering**

   - Filter by: genre, release year, rating, duration range, content type
   - Sorting: relevance, date, rating, popularity
   - Pagination with cursor-based approach

3. **Autocomplete Endpoint**
   ```
   GET /api/v1/search/autocomplete?q={query}
   ```


   - Fast prefix search on titles
   - Return top 10 results
   - Include content type and thumbnail

4. **Main Search Endpoint**
   ```
   GET /api/v1/search?q={query}&type={type}&genre={genre}&year={year}&rating={min-max}&sort={field}&order={asc|desc}&page={page}&limit={limit}
   ```


**Optimizations:**

- Database indexes on searchable fields (title, type, rating)
- Composite indexes for common filter combinations
- Query result caching with TTL
- Search analytics tracking

**Files to Create:**

- `src/search/search.module.ts`
- `src/search/search.service.ts`
- `src/search/search.controller.ts`
- `src/search/dto/search-query.dto.ts`
- `src/search/dto/autocomplete-query.dto.ts`

### Task 3.5: Add Content Rating and Review System (10-12 hours)

**Entities:**

1. **Rating Entity** (`src/ratings/entities/rating.entity.ts`)

   - Fields: id, userId, contentId, score (1-5 or thumbs up/down), createdAt, updatedAt
   - Unique constraint on (userId, contentId)

2. **Review Entity** (`src/reviews/entities/review.entity.ts`)

   - Fields: id, userId, contentId, ratingId, reviewText, likes, dislikes, isModerated, status, createdAt, updatedAt

**Endpoints:**

```
POST   /api/v1/content/:id/ratings        - Rate content (user)
GET    /api/v1/content/:id/ratings        - Get aggregate ratings
POST   /api/v1/content/:id/reviews        - Submit review (user)
GET    /api/v1/content/:id/reviews        - Get reviews (paginated)
PATCH  /api/v1/reviews/:id                - Update own review
DELETE /api/v1/reviews/:id                - Delete own review
POST   /api/v1/reviews/:id/like           - Like a review
POST   /api/v1/admin/reviews/:id/moderate - Moderate review (admin)
```

**Features:**

- Aggregate rating calculation (average, count)
- Update content rating whenever new rating is submitted
- Review moderation workflow (pending, approved, rejected)
- Spam/profanity detection (basic)
- Sort reviews by: most recent, most liked, highest/lowest rating
- User can only rate/review once per content

**Files to Create:**

- `src/ratings/ratings.module.ts`
- `src/ratings/ratings.service.ts`
- `src/ratings/ratings.controller.ts`
- `src/ratings/entities/rating.entity.ts`
- `src/reviews/reviews.module.ts`
- `src/reviews/reviews.service.ts`
- `src/reviews/reviews.controller.ts`
- `src/reviews/entities/review.entity.ts`
- DTOs for both modules

## Additional Considerations

### Swagger Documentation

Install `@nestjs/swagger` and configure in `main.ts`:

- Add API decorators to all endpoints
- Group endpoints by modules
- Document request/response schemas
- Add authentication requirements

### Authentication & Authorization

For admin endpoints, implement:

- JWT-based authentication guard
- Role-based authorization (Admin, User)
- Protect admin routes with `@UseGuards(JwtAuthGuard, RolesGuard)`

### Validation & Error Handling

- Use `class-validator` decorators in all DTOs
- Global validation pipe in `main.ts`
- Custom exception filters for user-friendly errors
- Proper HTTP status codes

### Testing

- Unit tests for services (mocked repositories)
- E2E tests for critical endpoints
- Test data fixtures for development

```