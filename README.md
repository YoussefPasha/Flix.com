# Flix - Full Stack Movie/Series Application

A modern full-stack application for managing movies and TV series, built with NestJS (backend) and Next.js (frontend).

> **⚡ Want to get started quickly?** See [QUICK-START.md](./QUICK-START.md) for one-command setup!

## 🚀 Features

- **Backend (NestJS):**
  - RESTful API with versioning
  - PostgreSQL database with TypeORM
  - Content management (Movies & Series)
  - Genres, Tags, Cast & Crew management
  - Ratings and Reviews system
  - Advanced search functionality
  - Docker support (dev & prod)

- **Frontend (Next.js):**
  - Modern React 19 with Next.js 16
  - TanStack Query for data fetching
  - Tailwind CSS for styling
  - Responsive design
  - Docker support (dev & prod)

## 📋 Prerequisites

- Node.js 20+
- Docker & Docker Compose (recommended)
- PostgreSQL 16 (if running without Docker)
- Yarn package manager

## 🐳 Quick Start with Docker (Recommended)

The easiest way to run the entire application:

```bash
# Clone the repository
git clone <your-repo-url>
cd task1

# Start all services (backend + frontend + database)
docker-compose up -d

# View logs
docker-compose logs -f
```

Access the application:
- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:3000
- **Database:** localhost:5432

For detailed Docker instructions, see [DOCKER.md](./DOCKER.md)

## 💻 Local Development (Without Docker)

### Backend Setup

```bash
cd backend

# Install dependencies
yarn install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
yarn migration:run

# Seed database (optional)
yarn seed

# Start development server
yarn start:dev
```

Backend will be available at http://localhost:3000

### Frontend Setup

```bash
cd client

# Install dependencies
yarn install

# Configure environment
cp .env.example .env
# Set NEXT_PUBLIC_API_URL=http://localhost:3000

# Start development server
yarn dev
```

Frontend will be available at http://localhost:3001

## 🏗️ Project Structure

```
task1/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── content/        # Movies & Series
│   │   ├── genres/         # Genre management
│   │   ├── tags/           # Tag management
│   │   ├── cast-crew/      # Cast & Crew
│   │   ├── ratings/        # Rating system
│   │   ├── reviews/        # Review system
│   │   └── search/         # Search functionality
│   ├── Dockerfile          # Production Docker image
│   ├── Dockerfile.dev      # Development Docker image
│   └── docker-compose.yml  # Backend services
│
├── client/                  # Next.js Frontend
│   ├── src/
│   │   ├── app/            # App router pages
│   │   ├── components/     # Reusable components
│   │   ├── features/       # Feature-specific code
│   │   └── lib/            # Utilities
│   ├── Dockerfile          # Production Docker image
│   ├── Dockerfile.dev      # Development Docker image
│   └── docker-compose.yml  # Frontend services
│
├── docker-compose.yml       # Full stack development
├── docker-compose.prod.yml  # Full stack production with Traefik
└── DOCKER.md               # Detailed Docker documentation
```

## 🔧 Available Scripts

### Backend

```bash
yarn start:dev          # Start development server
yarn build              # Build for production
yarn start:prod         # Start production server
yarn lint               # Run linter
yarn test               # Run tests
yarn migration:generate # Generate new migration
yarn migration:run      # Run migrations
yarn seed               # Seed database
```

### Frontend

```bash
yarn dev                # Start development server
yarn build              # Build for production
yarn start              # Start production server
yarn lint               # Run linter
```

### Docker

```bash
# Development
docker-compose up -d                    # Start all services
docker-compose logs -f                  # View logs
docker-compose down                     # Stop services

# Production
docker-compose -f docker-compose.prod.yml up -d    # Start production
docker-compose -f docker-compose.prod.yml down     # Stop production
```

## 🌐 Production Deployment

The project includes a complete production setup with:

- ✅ Traefik reverse proxy
- ✅ Automatic SSL certificates (Let's Encrypt)
- ✅ HTTP to HTTPS redirect
- ✅ Security headers
- ✅ Multi-stage Docker builds
- ✅ Health checks

### Quick Production Deploy

1. **Configure DNS:**
   ```
   A    flix.com       → YOUR_SERVER_IP
   A    www.flix.com   → YOUR_SERVER_IP
   A    api.flix.com   → YOUR_SERVER_IP
   ```

2. **Set environment variables:**
   ```bash
   # Create production .env file
   cp .env.example .env.production
   # Edit with production values
   ```

3. **Deploy:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

See [DOCKER.md](./DOCKER.md) for detailed production setup instructions.

## 📚 API Documentation

Once the backend is running, access the API documentation at:
- Development: http://localhost:3000/api
- Production: https://api.flix.com/api

## 🧪 Testing

```bash
# Backend
cd backend
yarn test                    # Unit tests
yarn test:e2e               # E2E tests
yarn test:cov               # Test coverage

# Frontend
cd client
yarn test                    # Run tests (if configured)
```

## 🔐 Environment Variables

Environment configuration files are located at:
- **Root:** `env.sample` - Full stack configuration
- **Backend:** `backend/env.sample` - Backend-specific
- **Frontend:** `client/env.sample` - Frontend-specific

### Quick Setup

```bash
# Full stack (recommended)
cp env.sample .env

# Backend only
cd backend && cp env.sample .env

# Frontend only
cd client && cp env.sample .env.local
```

### Key Variables

**Backend:**
- `DATABASE_*` - PostgreSQL connection
- `JWT_SECRET` - Authentication secret (change in production!)
- `CORS_ORIGINS` - Allowed frontend origins

**Frontend:**
- `NEXT_PUBLIC_API_URL` - Backend API endpoint
- `FRONTEND_PORT` - Port for frontend (default: 3001)

**Production:**
- `FRONTEND_DOMAIN` - Your frontend domain (e.g., flix.com)
- `BACKEND_DOMAIN` - Your API domain (e.g., api.flix.com)
- `ACME_EMAIL` - Email for SSL certificates

For complete configuration guide, see [ENV-SETUP.md](./ENV-SETUP.md)

## 🛠️ Tech Stack

### Backend
- NestJS
- TypeORM
- PostgreSQL
- Class Validator
- Docker

### Frontend
- Next.js 16
- React 19
- TypeScript
- TanStack Query
- Tailwind CSS
- Radix UI
- React Hook Form
- Zod

### Infrastructure
- Docker & Docker Compose
- Traefik (reverse proxy)
- Let's Encrypt (SSL)

## 📖 Additional Documentation

### 📘 Main Guides

- **[QUICK-START.md](./QUICK-START.md)** - ⚡ One-command setup guide (start here!)
- **[ENV-SETUP.md](./ENV-SETUP.md)** - 🔐 Environment variables configuration
- **[DOCKER.md](./DOCKER.md)** - 🐳 Comprehensive Docker guide (production setup)
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - 🚀 All deployment scenarios and workflows
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - 🏗️ System architecture and design decisions

### 📄 Component Documentation

- [Backend README](./backend/README.md) - Backend-specific documentation
- [Frontend README](./client/README.md) - Frontend-specific documentation
- [Features.md](./Features.md) - Detailed feature list

### ⚠️ Important Notes

> **Production Deployment:** Always use the **root-level `docker-compose.prod.yml`** which includes a single shared Traefik instance for both frontend and backend.

> **Why Single Traefik?** Using one Traefik instance instead of multiple provides:
> - ✅ Centralized SSL certificate management
> - ✅ No port conflicts
> - ✅ Better resource utilization
> - ✅ Unified routing configuration
> - ✅ Simpler debugging and maintenance

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed explanation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

Youssef Pasha

## 🐛 Issues

Found a bug? Please open an issue on GitHub.

## ⭐ Show your support

Give a ⭐️ if this project helped you!

