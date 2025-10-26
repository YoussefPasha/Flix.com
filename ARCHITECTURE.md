# Flix Application Architecture

## Overview

Flix is a full-stack application with a NestJS backend, Next.js frontend, PostgreSQL database, and Traefik reverse proxy.

## Development Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Network                        │
│                                                          │
│  ┌──────────────┐     ┌──────────────┐     ┌─────────┐ │
│  │  Frontend    │────▶│   Backend    │────▶│  Postgres│ │
│  │  (Next.js)   │     │  (NestJS)    │     │  (PG 16) │ │
│  │  Port: 3001  │     │  Port: 3000  │     │Port: 5432│ │
│  └──────────────┘     └──────────────┘     └─────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
         ▲                      ▲                  ▲
         │                      │                  │
    localhost:3001         localhost:3000    localhost:5432
```

### Development Services

- **Frontend:** Direct access on port 3001 with hot reload
- **Backend:** Direct access on port 3000 with hot reload
- **Database:** Direct access on port 5432
- **No reverse proxy needed** - services communicate directly

## Production Architecture

```
                       ┌──────────────────┐
                       │    Internet      │
                       └────────┬─────────┘
                                │
                                │ DNS
                                │ flix.com → Server IP
                                │ api.flix.com → Server IP
                                │
                      ┌─────────▼──────────┐
                      │      Traefik       │
                      │  Reverse Proxy     │
                      │   Port 80, 443     │
                      │                    │
                      │ • SSL Termination  │
                      │ • Auto HTTPS       │
                      │ • Domain Routing   │
                      └───┬────────────┬───┘
                          │            │
              ┌───────────┘            └───────────┐
              │                                    │
      ┌───────▼─────────┐              ┌──────────▼──────────┐
      │    Frontend     │              │      Backend        │
      │   Container     │              │     Container       │
      │   flix.com      │─────────────▶│   api.flix.com      │
      │   www.flix.com  │   API calls  │                     │
      │   (Next.js)     │              │    (NestJS)         │
      │   Port: 3000    │              │    Port: 3000       │
      └─────────────────┘              └──────────┬──────────┘
                                                  │
                                        ┌─────────▼──────────┐
                                        │     PostgreSQL     │
                                        │     Container      │
                                        │    Port: 5432      │
                                        │   (not exposed)    │
                                        └────────────────────┘
```

### Production Services

- **Traefik (Single Instance):**
  - Listens on ports 80 (HTTP) and 443 (HTTPS)
  - Automatically obtains SSL certificates from Let's Encrypt
  - Routes `flix.com` → Frontend
  - Routes `api.flix.com` → Backend
  - Redirects HTTP → HTTPS
  - Redirects www → non-www
  - Adds security headers

- **Frontend:**
  - Internal port 3000
  - Accessible via Traefik at `https://flix.com`
  - Static content served by Next.js standalone server

- **Backend:**
  - Internal port 3000
  - Accessible via Traefik at `https://api.flix.com`
  - REST API with versioning

- **PostgreSQL:**
  - Internal port 5432
  - NOT exposed to internet
  - Only accessible by backend container

## Why Single Traefik Instance?

### ✅ Benefits

1. **Resource Efficiency:** One reverse proxy instead of multiple
2. **Unified SSL Management:** Single certificate store for all domains
3. **Simplified Configuration:** One place to configure routing rules
4. **Better Monitoring:** Centralized access logs and metrics
5. **Easier Maintenance:** Update one service instead of many

### ❌ Problems with Multiple Traefik Instances

1. **Port Conflicts:** Both would try to bind to ports 80 and 443
2. **Certificate Duplication:** Each would request certificates separately
3. **Higher Resource Usage:** More memory and CPU overhead
4. **Configuration Complexity:** Need to coordinate between instances
5. **Debugging Difficulty:** Which Traefik handled which request?

## Request Flow

### Frontend Request (User visits https://flix.com)

```
1. Browser → DNS Lookup → Server IP
2. Browser → HTTPS Request to Server IP:443
3. Traefik → Checks Host header (flix.com)
4. Traefik → Routes to Frontend container:3000
5. Frontend → Returns HTML/CSS/JS
6. Traefik → Adds security headers
7. Traefik → Returns to Browser
```

### API Request (Frontend calls API)

```
1. Frontend → Fetch https://api.flix.com/api/v1/content
2. Request → Traefik (Host: api.flix.com)
3. Traefik → Routes to Backend container:3000
4. Backend → Processes request
5. Backend → Queries PostgreSQL:5432
6. Backend → Returns JSON response
7. Traefik → Adds CORS headers
8. Traefik → Returns to Frontend
```

## Network Configuration

### Development

```yaml
networks:
  flix-network:
    driver: bridge
```

All containers on same network can communicate using container names:
- Frontend calls backend via `http://backend:3000`
- Backend calls postgres via `postgres:5432`

### Production

```yaml
networks:
  flix-network:
    driver: bridge
```

Same network setup, but:
- External traffic goes through Traefik
- Internal services communicate directly
- Only Traefik ports are exposed

## Security Layers

### Layer 1: Traefik (Edge)

- SSL/TLS termination
- HTTP to HTTPS redirect
- Security headers (HSTS, X-Frame-Options, etc.)
- Request size limits
- Rate limiting (can be added)

### Layer 2: Backend (API)

- JWT authentication
- Input validation
- SQL injection prevention (TypeORM)
- CORS configuration

### Layer 3: Database

- Not exposed to internet
- Strong password
- Limited to backend connections only

## Scaling Considerations

### Horizontal Scaling

To handle more traffic:

```yaml
frontend:
  deploy:
    replicas: 3  # Run 3 frontend containers

backend:
  deploy:
    replicas: 3  # Run 3 backend containers
```

Traefik automatically load-balances across replicas.

### Vertical Scaling

Add resource limits:

```yaml
backend:
  deploy:
    resources:
      limits:
        cpus: '2.0'
        memory: 2G
```

## Monitoring & Observability

### Traefik Dashboard

Optional dashboard for monitoring:

```yaml
traefik:
  command:
    - --api.dashboard=true
  labels:
    - 'traefik.http.routers.dashboard.rule=Host(`traefik.flix.com`)'
```

### Logs

All logs accessible via Docker:

```bash
# View all logs
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f traefik
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

### Health Checks

All services include health checks:

```yaml
healthcheck:
  test: ['CMD', 'curl', '-f', 'http://localhost:3000/health']
  interval: 30s
  timeout: 10s
  retries: 3
```

## Deployment Workflow

### Local Development

```bash
docker-compose up -d
```

### Staging/Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Rolling Updates

```bash
# Build new images
docker-compose -f docker-compose.prod.yml build

# Update services one by one (zero downtime)
docker-compose -f docker-compose.prod.yml up -d --no-deps frontend
docker-compose -f docker-compose.prod.yml up -d --no-deps backend
```

## Backup & Recovery

### Database Backup

```bash
docker-compose exec postgres pg_dump -U postgres flix_db > backup.sql
```

### SSL Certificates

Certificates stored in Docker volume:

```bash
docker volume inspect task1_traefik_letsencrypt
```

### Full System Backup

```bash
# Backup volumes
docker run --rm \
  -v task1_postgres_prod_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/postgres_backup.tar.gz /data

docker run --rm \
  -v task1_traefik_letsencrypt:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/traefik_backup.tar.gz /data
```

## Troubleshooting

### Traefik Not Routing Correctly

```bash
# Check Traefik logs
docker-compose -f docker-compose.prod.yml logs traefik | grep -i error

# Verify container labels
docker inspect flix_backend_prod | grep -A 20 Labels
docker inspect flix_frontend_prod | grep -A 20 Labels

# Check network connectivity
docker network inspect task1_flix-network
```

### SSL Certificate Issues

```bash
# Check certificate status
docker-compose -f docker-compose.prod.yml exec traefik cat /letsencrypt/acme.json

# Verify DNS resolution
nslookup flix.com
nslookup api.flix.com

# Test HTTP challenge
curl -I http://flix.com/.well-known/acme-challenge/test
```

### Service Can't Reach Another Service

```bash
# Verify network
docker-compose -f docker-compose.prod.yml exec backend ping postgres
docker-compose -f docker-compose.prod.yml exec frontend ping backend

# Check service is running
docker-compose -f docker-compose.prod.yml ps

# Check port bindings
docker port flix_backend_prod
docker port flix_frontend_prod
```

## Summary

- **One Traefik instance** handles all HTTP/HTTPS traffic
- **Automatic SSL** for all configured domains
- **Network isolation** keeps services secure
- **Easy to scale** horizontally or vertically
- **Simple to maintain** with Docker Compose


