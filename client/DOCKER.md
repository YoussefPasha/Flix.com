# Docker Setup for Flix Frontend

This document explains how to run the frontend application using Docker in both development and production environments.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 20+ (for local development)
- Backend API running (or accessible)

## Environment Variables

Create a `.env` file in the client directory with the following variables:

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:3000

# Frontend Port (default: 3001)
FRONTEND_PORT=3001

# For production with Traefik
ACME_EMAIL=your-email@example.com
```

## Development Mode

### Using Docker Compose

```bash
# Start the development server
docker-compose up

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the server
docker-compose down
```

The development server will be available at `http://localhost:3001` (or your configured `FRONTEND_PORT`).

### Features

- Hot reload enabled
- Source code mounted as volume for instant changes
- Node modules cached in container
- Development optimizations

### Building Manually

```bash
# Build the development image
docker build -f Dockerfile.dev -t flix-frontend-dev .

# Run the container
docker run -p 3001:3000 \
  -v $(pwd):/app \
  -v /app/node_modules \
  -e NEXT_PUBLIC_API_URL=http://localhost:3000 \
  flix-frontend-dev
```

## Production Mode

### Important: Traefik Setup

The frontend production docker-compose assumes **Traefik is already running** (typically from the backend or root docker-compose). 

**Recommended:** Use the **root-level docker-compose.prod.yml** for full-stack deployment with a single shared Traefik instance.

### Standalone Frontend Deployment (with existing Traefik)

If the backend with Traefik is already running:

```bash
# Start frontend only (connects to existing Traefik)
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

### Full Stack Deployment (Recommended)

From the project root:

```bash
# This starts backend + frontend + postgres + Traefik all together
docker-compose -f docker-compose.prod.yml up -d
```

### Traefik Configuration

The production setup includes:

- **Automatic SSL certificates** via Let's Encrypt (handled by shared Traefik)
- **HTTP to HTTPS redirect**
- **www to non-www redirect**
- **Security headers**
- Domain routing for `flix.com` and `www.flix.com`

### Domain Configuration

Update the Traefik labels in `docker-compose.prod.yml` to match your domain:

```yaml
labels:
  - 'traefik.http.routers.frontend.rule=Host(`yourdomain.com`) || Host(`www.yourdomain.com`)'
```

### Building Manually

```bash
# Build the production image
docker build -t flix-frontend-prod .

# Run the container
docker run -p 3001:3000 \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_API_URL=https://api.flix.com \
  flix-frontend-prod
```

## Full Stack Setup

To run both backend and frontend together:

### Development

```bash
# From the project root - use the root docker-compose.yml
docker-compose up -d

# Or run individually
cd backend && docker-compose up -d
cd ../client && docker-compose up -d
```

### Production

**Always use the root-level docker-compose.prod.yml for production** to ensure a single Traefik instance handles all routing:

```bash
# From the project root
docker-compose -f docker-compose.prod.yml up -d
```

This configuration uses a single Traefik instance for both services:

```yaml
services:
  # Backend services (from backend/docker-compose.prod.yml)
  postgres:
    # ... postgres config
  
  backend:
    # ... backend config
  
  # Frontend service
  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile
    container_name: flix_frontend_prod
    restart: always
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_API_URL: https://api.flix.com
    labels:
      - 'traefik.enable=true'
      - 'traefik.http.routers.frontend.rule=Host(`flix.com`) || Host(`www.flix.com`)'
      - 'traefik.http.routers.frontend.entrypoints=websecure'
      - 'traefik.http.routers.frontend.tls.certresolver=myresolver'
      - 'traefik.http.services.frontend.loadbalancer.server.port=3000'
  
  # Traefik (shared for both frontend and backend)
  traefik:
    image: traefik:v3.0
    container_name: flix_traefik
    restart: always
    command:
      - --log.level=INFO
      - --providers.docker=true
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
      - --certificatesresolvers.myresolver.acme.httpchallenge=true
      - --certificatesresolvers.myresolver.acme.httpchallenge.entrypoint=web
      - --certificatesresolvers.myresolver.acme.email=your-email@example.com
      - --certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json
      - --entrypoints.web.http.redirections.entrypoint.to=websecure
      - --entrypoints.web.http.redirections.entrypoint.scheme=https
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - traefik_letsencrypt:/letsencrypt
```

## Optimization

### Production Build Features

- **Multi-stage build** for smaller image size
- **Standalone output** - only necessary files included
- **Non-root user** for security
- **Optimized caching** layers

### Build Size Comparison

- Full Next.js install: ~500MB
- Standalone build: ~150MB
- Production image: ~180MB

## Troubleshooting

### Port Already in Use

```bash
# Check what's using the port
lsof -i :3001

# Kill the process or change FRONTEND_PORT in .env
```

### Build Fails

```bash
# Clean Docker cache
docker builder prune -a

# Remove old images
docker rmi flix-frontend-dev flix-frontend-prod

# Rebuild
docker-compose build --no-cache
```

### Hot Reload Not Working

Ensure volumes are properly mounted in `docker-compose.yml`:

```yaml
volumes:
  - .:/app
  - /app/node_modules
  - /app/.next
```

### SSL Certificate Issues

Check Traefik logs:

```bash
docker-compose -f docker-compose.prod.yml logs traefik
```

Ensure:
- Ports 80 and 443 are accessible
- DNS records point to your server
- Email is configured correctly

## Commands Reference

```bash
# Development
docker-compose up                          # Start dev server
docker-compose up -d                       # Start in background
docker-compose logs -f                     # View logs
docker-compose down                        # Stop server
docker-compose build                       # Rebuild image

# Production
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml logs -f
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build

# Clean up
docker system prune -a                     # Remove all unused Docker data
docker volume prune                        # Remove unused volumes
```

## Security Best Practices

1. **Never commit** `.env` files with sensitive data
2. **Use secrets** for production credentials
3. **Keep images updated** regularly
4. **Limit resource usage** in production
5. **Use non-root users** (already configured)
6. **Enable security headers** in Next.js config

## Performance Tips

1. **Enable caching** in Traefik for static assets
2. **Use CDN** for public assets
3. **Enable compression** in Next.js
4. **Monitor container resources**
5. **Use health checks**

## Next Steps

1. Configure your domain DNS to point to your server
2. Update Traefik labels with your domain
3. Set up monitoring and logging
4. Configure backup strategy
5. Set up CI/CD pipeline

