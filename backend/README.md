# Flix.com - Content Management System Backend

A comprehensive Content Management System (CMS) for managing movies, TV shows, and related metadata built with NestJS, TypeORM, and PostgreSQL.

## 🎯 Features

- **Content Management**: Full CRUD operations for movies and TV shows
- **Media Organization**: Seasons and episodes management for TV shows
- **Categorization**: Genre and tag system with hierarchical support
- **Cast & Crew Management**: Track actors, directors, producers, and other crew members
- **Rating System**: User ratings with aggregate calculations
- **Review System**: User reviews with moderation workflow
- **Advanced Search**: Full-text search with filters and autocomplete
- **REST API**: Well-documented RESTful endpoints
- **Swagger Documentation**: Interactive API documentation
- **Docker Support**: Containerized development and production environments
- **Database Migrations**: Version-controlled schema management
- **Database Seeders**: Sample data for testing and development
- **Comprehensive Testing**: Unit and E2E tests with Jest

## 🛠️ Technology Stack

- **Framework**: NestJS 11.x
- **Database**: PostgreSQL 16 (Docker)
- **ORM**: TypeORM 0.3.x
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Containerization**: Docker & Docker Compose
- **Language**: TypeScript 5.x

## 📋 Prerequisites

- Node.js 18+ and Yarn
- Docker and Docker Compose
- Git

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd backend
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=flix_db

# Security
JWT_SECRET=your-secret-key-change-in-production
```

## 🐳 Running with Docker

### Development Environment

**Start all services (PostgreSQL + Backend):**

```bash
docker-compose up -d
```

This will:
- Start PostgreSQL on port 5432
- Start the backend in watch mode on port 3000
- Auto-reload on code changes
- Create persistent volume for database data

**View logs:**

```bash
docker-compose logs -f backend
```

**Stop services:**

```bash
docker-compose down
```

### Production Environment

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 💾 Database Management

### Run Migrations

Migrations are automatically executed when running with Docker. To run manually:

```bash
# Run all pending migrations
yarn migration:run

# Revert last migration
yarn migration:revert

# Generate a new migration
yarn migration:generate src/database/migrations/MigrationName

# Create an empty migration
yarn migration:create src/database/migrations/MigrationName
```

### Seed Database

Populate the database with sample data:

```bash
# With Docker
docker-compose exec backend yarn seed

# Without Docker (ensure PostgreSQL is running)
yarn seed
```

This will create:
- 15 genres (Action, Drama, Comedy, etc.)
- 15 tags (Award Winner, Blockbuster, etc.)
- 10+ cast & crew members
- Sample movies and TV shows with seasons/episodes
- Sample ratings and reviews

## 🎮 Running the Application

### Development Mode (without Docker)

Ensure PostgreSQL is running, then:

```bash
yarn start:dev
```

The API will be available at `http://localhost:3000`

### Production Mode

```bash
# Build the application
yarn build

# Start production server
yarn start:prod
```

### Debug Mode

```bash
yarn start:debug
```

## 🧪 Testing

### Unit Tests

```bash
# Run all unit tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:cov
```

### E2E Tests

```bash
# Run end-to-end tests
yarn test:e2e
```

### Linting

```bash
# Run ESLint and auto-fix issues
yarn lint

# Format code with Prettier
yarn format
```

## 📚 API Documentation

Once the application is running, access the interactive Swagger documentation:

```
http://localhost:3000/api/docs
```

### API Versioning

The API uses **URI-based versioning** for clear version management:

- **Current Version**: v1
- **Base URL**: `http://localhost:3000/api/v1`
- **Versioning Strategy**: `/api/{version}/{resource}`

#### Version Information

- **v1.0.0** - Current stable version
  - All endpoints prefixed with `/api/v1/`
  - Full CRUD operations for all resources
  - Comprehensive search and filtering

#### Example Endpoints

```bash
# Admin endpoints
GET /api/v1/admin/content
GET /api/v1/admin/genres
GET /api/v1/admin/tags

# Public endpoints
GET /api/v1/search
GET /api/v1/content/:id/ratings
POST /api/v1/content/:id/reviews
```

For detailed versioning information, migration guides, and best practices, see:
- [API Versioning Documentation](./docs/API_VERSIONING.md)
- [API Changelog](./docs/CHANGELOG.md)

### API Endpoints Overview

#### Content Management
- `POST /api/v1/admin/content` - Create content
- `GET /api/v1/admin/content` - List all content (paginated)
- `GET /api/v1/admin/content/:id` - Get content by ID
- `PATCH /api/v1/admin/content/:id` - Update content
- `DELETE /api/v1/admin/content/:id` - Delete content
- `POST /api/v1/admin/content/:id/seasons` - Add season
- `POST /api/v1/admin/content/:contentId/seasons/:seasonId/episodes` - Add episode

#### Genres
- `POST /api/v1/admin/genres` - Create genre
- `GET /api/v1/admin/genres` - List all genres
- `GET /api/v1/admin/genres/tree` - Get hierarchical genre tree
- `GET /api/v1/admin/genres/:id` - Get genre by ID
- `GET /api/v1/admin/genres/slug/:slug` - Get genre by slug
- `PATCH /api/v1/admin/genres/:id` - Update genre
- `DELETE /api/v1/admin/genres/:id` - Delete genre

#### Tags
- `POST /api/v1/admin/tags` - Create tag
- `GET /api/v1/admin/tags` - List all tags
- `GET /api/v1/admin/tags/:id` - Get tag by ID
- `PATCH /api/v1/admin/tags/:id` - Update tag
- `DELETE /api/v1/admin/tags/:id` - Delete tag

#### Cast & Crew
- `POST /api/v1/admin/cast-crew` - Create cast/crew member
- `GET /api/v1/admin/cast-crew` - List all cast/crew
- `GET /api/v1/admin/cast-crew/:id` - Get cast/crew by ID
- `PATCH /api/v1/admin/cast-crew/:id` - Update cast/crew
- `DELETE /api/v1/admin/cast-crew/:id` - Delete cast/crew

#### Ratings
- `POST /api/v1/content/:contentId/ratings` - Create rating
- `GET /api/v1/content/:contentId/ratings` - Get aggregate rating
- `GET /api/v1/content/:contentId/ratings/user` - Get user's rating
- `PATCH /api/v1/ratings/:id` - Update rating
- `DELETE /api/v1/ratings/:id` - Delete rating

#### Reviews
- `POST /api/v1/content/:contentId/reviews` - Create review
- `GET /api/v1/content/:contentId/reviews` - Get reviews (paginated)
- `GET /api/v1/reviews/:id` - Get review by ID
- `PATCH /api/v1/reviews/:id` - Update review
- `DELETE /api/v1/reviews/:id` - Delete review
- `POST /api/v1/reviews/:id/like` - Like review
- `POST /api/v1/reviews/:id/dislike` - Dislike review
- `PATCH /api/v1/admin/reviews/:id/moderate` - Moderate review
- `GET /api/v1/admin/reviews/pending` - Get pending reviews

#### Search
- `GET /api/v1/search` - Search content with filters
- `GET /api/v1/search/autocomplete` - Autocomplete suggestions
- `GET /api/v1/search/popular` - Get popular content
- `GET /api/v1/search/trending` - Get trending content

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.module.ts              # Root application module
│   ├── main.ts                    # Application entry point
│   │
│   ├── config/
│   │   ├── database.config.ts     # Database configuration
│   │   └── api-version.config.ts  # API versioning configuration
│   │
│   ├── database/
│   │   ├── database.module.ts     # Database module
│   │   ├── migrations/            # TypeORM migrations
│   │   │   └── 1730000000000-InitialSchema.ts
│   │   └── seeders/               # Database seeders
│   │       ├── seed.ts            # Main seeder runner
│   │       ├── genre.seeder.ts
│   │       ├── tag.seeder.ts
│   │       ├── cast-crew.seeder.ts
│   │       ├── content.seeder.ts
│   │       ├── rating.seeder.ts
│   │       └── review.seeder.ts
│   │
│   ├── content/                   # Content module (movies/shows)
│   │   ├── content.controller.ts
│   │   ├── content.service.ts
│   │   ├── content.service.spec.ts
│   │   ├── content.module.ts
│   │   ├── dto/
│   │   │   ├── create-content.dto.ts
│   │   │   ├── update-content.dto.ts
│   │   │   ├── content-query.dto.ts
│   │   │   ├── create-season.dto.ts
│   │   │   └── create-episode.dto.ts
│   │   └── entities/
│   │       ├── content.entity.ts
│   │       ├── season.entity.ts
│   │       └── episode.entity.ts
│   │
│   ├── genres/                    # Genre management
│   │   ├── genres.controller.ts
│   │   ├── genres.service.ts
│   │   ├── genres.service.spec.ts
│   │   ├── genres.module.ts
│   │   ├── dto/
│   │   │   ├── create-genre.dto.ts
│   │   │   └── update-genre.dto.ts
│   │   └── entities/
│   │       └── genre.entity.ts
│   │
│   ├── tags/                      # Tag management
│   │   ├── tags.controller.ts
│   │   ├── tags.service.ts
│   │   ├── tags.module.ts
│   │   ├── dto/
│   │   │   ├── create-tag.dto.ts
│   │   │   └── update-tag.dto.ts
│   │   └── entities/
│   │       └── tag.entity.ts
│   │
│   ├── cast-crew/                 # Cast & crew management
│   │   ├── cast-crew.controller.ts
│   │   ├── cast-crew.service.ts
│   │   ├── cast-crew.module.ts
│   │   ├── dto/
│   │   │   ├── create-cast-crew.dto.ts
│   │   │   └── update-cast-crew.dto.ts
│   │   └── entities/
│   │       └── cast-crew.entity.ts
│   │
│   ├── ratings/                   # Rating system
│   │   ├── ratings.controller.ts
│   │   ├── ratings.service.ts
│   │   ├── ratings.module.ts
│   │   ├── dto/
│   │   │   ├── create-rating.dto.ts
│   │   │   └── update-rating.dto.ts
│   │   └── entities/
│   │       └── rating.entity.ts
│   │
│   ├── reviews/                   # Review system
│   │   ├── reviews.controller.ts
│   │   ├── reviews.service.ts
│   │   ├── reviews.module.ts
│   │   ├── dto/
│   │   │   ├── create-review.dto.ts
│   │   │   ├── update-review.dto.ts
│   │   │   └── moderate-review.dto.ts
│   │   └── entities/
│   │       └── review.entity.ts
│   │
│   └── search/                    # Search functionality
│       ├── search.controller.ts
│       ├── search.service.ts
│       ├── search.module.ts
│       └── dto/
│           ├── search-query.dto.ts
│           └── autocomplete-query.dto.ts
│
├── test/                          # E2E tests
│   ├── app.e2e-spec.ts
│   ├── content.e2e-spec.ts
│   ├── genres.e2e-spec.ts
│   └── jest-e2e.json
│
├── docs/                          # Documentation
│   ├── API_VERSIONING.md          # API versioning strategy
│   └── CHANGELOG.md               # API changelog
│
├── docker-compose.yml             # Development Docker setup
├── docker-compose.prod.yml        # Production Docker setup
├── Dockerfile.dev                 # Development Dockerfile
├── Dockerfile                     # Production Dockerfile
├── typeorm.config.ts              # TypeORM CLI configuration
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
└── .env                           # Environment variables (not in repo)
```

## 🔧 Available Scripts

```bash
# Development
yarn start              # Start application
yarn start:dev          # Start in watch mode
yarn start:debug        # Start with debugger

# Building
yarn build              # Build for production
yarn start:prod         # Run production build

# Testing
yarn test               # Run unit tests
yarn test:watch         # Run tests in watch mode
yarn test:cov           # Run tests with coverage
yarn test:e2e           # Run E2E tests

# Code Quality
yarn lint               # Run ESLint
yarn format             # Format code with Prettier

# Database
yarn migration:run      # Run migrations
yarn migration:revert   # Revert last migration
yarn migration:generate # Generate new migration
yarn migration:create   # Create empty migration
yarn seed               # Seed database with sample data

# TypeORM CLI
yarn typeorm            # Run TypeORM CLI commands
```

## 🏗️ Database Schema

### Core Entities

- **Content**: Movies and TV shows with metadata
- **Season**: TV show seasons
- **Episode**: Individual episodes
- **Genre**: Content genres with hierarchical support
- **Tag**: Content tags for categorization
- **CastCrew**: Actors, directors, producers
- **Rating**: User ratings (1-5 stars)
- **Review**: User reviews with moderation

### Relationships

- Content ↔ Genre (Many-to-Many)
- Content ↔ Tag (Many-to-Many)
- Content ↔ CastCrew (Many-to-Many)
- Content ↔ Season (One-to-Many)
- Season ↔ Episode (One-to-Many)
- Content ↔ Rating (One-to-Many)
- Content ↔ Review (One-to-Many)
- Rating ↔ Review (One-to-One, optional)

## 🔒 Security Considerations

- **Environment Variables**: Never commit `.env` files
- **JWT Secret**: Use strong secrets in production
- **Input Validation**: All DTOs use class-validator
- **SQL Injection**: Protected by TypeORM parameterized queries
- **CORS**: Configure appropriately for production
- **Rate Limiting**: Consider adding for production (not implemented)

## 🚦 Health Check

```bash
# Check if application is running
curl http://localhost:3000

# Check database connection
curl http://localhost:3000/api/v1/admin/genres
```

## 📊 Monitoring and Logging

The application logs:
- Application startup and shutdown
- HTTP requests (in development)
- Database queries (in development)
- Errors and exceptions

Logs are output to console. For production, consider integrating:
- Winston or Pino for structured logging
- Log aggregation service (e.g., ELK Stack, DataDog)
- Application Performance Monitoring (APM)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is [MIT licensed](LICENSE).

## 👥 Support

For questions and support:
- Check the [API Documentation](http://localhost:3000/api/docs)
- Review existing issues
- Create a new issue with detailed information

## 🎓 Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com)

---

**Built with ❤️ using NestJS**
