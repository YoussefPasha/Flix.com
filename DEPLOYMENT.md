# Deployment Guide

Quick reference for deploying the Flix application in different scenarios.

## 📋 Quick Decision Tree

```
Are you deploying for...?

├─ Development/Testing
│  └─ Use: docker-compose.yml (root level)
│     Command: docker-compose up -d
│
└─ Production
   └─ Use: docker-compose.prod.yml (root level)
      Command: docker-compose -f docker-compose.prod.yml up -d
```

## 🚀 Deployment Scenarios

### Scenario 1: Full Stack Development (Recommended)

**When:** Local development, testing, debugging

**Use:** Root-level `docker-compose.yml`

```bash
# From project root
docker-compose up -d
```

**What you get:**
- ✅ Frontend on http://localhost:3001
- ✅ Backend on http://localhost:3000
- ✅ PostgreSQL on localhost:5432
- ✅ Hot reload for both services
- ✅ Direct port access (no reverse proxy)

**Network:** All services on `flix-network` bridge

---

### Scenario 2: Full Stack Production (Recommended)

**When:** Deploying to production server

**Use:** Root-level `docker-compose.prod.yml`

```bash
# From project root
docker-compose -f docker-compose.prod.yml up -d
```

**What you get:**
- ✅ Frontend at https://flix.com
- ✅ Backend at https://api.flix.com
- ✅ PostgreSQL (internal only)
- ✅ Traefik with automatic SSL
- ✅ HTTP → HTTPS redirect
- ✅ www → non-www redirect
- ✅ Security headers

**Network:** All services on `flix-network` with Traefik as entry point

---

### Scenario 3: Backend Only (Development)

**When:** Working on backend features only

**Use:** `backend/docker-compose.yml`

```bash
cd backend
docker-compose up -d
```

**What you get:**
- ✅ Backend on http://localhost:3000
- ✅ PostgreSQL on localhost:5432
- ✅ Hot reload
- ✅ Isolated testing

---

### Scenario 4: Backend Only (Production)

**When:** Backend already deployed, testing backend

**Use:** `backend/docker-compose.prod.yml`

```bash
cd backend
docker-compose -f docker-compose.prod.yml up -d
```

**What you get:**
- ✅ Backend at https://api.flix.com
- ✅ PostgreSQL (internal)
- ✅ Traefik with SSL
- ⚠️ Frontend won't be available

**Note:** This includes its own Traefik instance. For full stack, use root-level compose.

---

### Scenario 5: Frontend Only (Development)

**When:** Working on frontend features, backend running separately

**Use:** `client/docker-compose.yml`

```bash
cd client
docker-compose up -d
```

**What you get:**
- ✅ Frontend on http://localhost:3001
- ✅ Hot reload
- ⚠️ Requires backend running at NEXT_PUBLIC_API_URL

**Environment:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

### Scenario 6: Frontend Only (Production)

**When:** Frontend deployment with existing backend + Traefik

**Use:** `client/docker-compose.prod.yml`

```bash
cd client
docker-compose -f docker-compose.prod.yml up -d
```

**What you get:**
- ✅ Frontend at https://flix.com
- ⚠️ Requires Traefik already running
- ⚠️ Connects to `backend_default` network

**Prerequisites:**
- Traefik must be running (from backend docker-compose)
- Backend must be accessible

**Environment:**
```env
NEXT_PUBLIC_API_URL=https://api.flix.com
```

---

## 🔄 Comparison Table

| Scenario | Command Location | Traefik | SSL | Hot Reload | Use Case |
|----------|-----------------|---------|-----|------------|----------|
| **Full Stack Dev** | Root | ❌ | ❌ | ✅ | Local development |
| **Full Stack Prod** | Root | ✅ (Shared) | ✅ | ❌ | Production deployment |
| **Backend Dev** | backend/ | ❌ | ❌ | ✅ | Backend work |
| **Backend Prod** | backend/ | ✅ (Own) | ✅ | ❌ | Backend testing |
| **Frontend Dev** | client/ | ❌ | ❌ | ✅ | Frontend work |
| **Frontend Prod** | client/ | ⚠️ (External) | ✅ | ❌ | Add to existing |

## 📍 Port Mappings

### Development

| Service | Container Port | Host Port | Access URL |
|---------|---------------|-----------|------------|
| Frontend | 3000 | 3001 | http://localhost:3001 |
| Backend | 3000 | 3000 | http://localhost:3000 |
| PostgreSQL | 5432 | 5432 | localhost:5432 |

### Production

| Service | Container Port | External URL | Notes |
|---------|---------------|--------------|-------|
| Frontend | 3000 | https://flix.com | Via Traefik |
| Backend | 3000 | https://api.flix.com | Via Traefik |
| PostgreSQL | 5432 | (not exposed) | Internal only |
| Traefik | 80, 443 | All traffic | Entry point |

## 🌐 Network Architecture

### Development Networks

```
Root docker-compose.yml:
  flix-network (bridge)
    ├─ frontend
    ├─ backend
    └─ postgres

Backend docker-compose.yml:
  backend_default (bridge)
    ├─ backend
    └─ postgres

Client docker-compose.yml:
  client_default (bridge)
    └─ frontend
```

### Production Networks

```
Root docker-compose.prod.yml:
  flix-network (bridge)
    ├─ traefik ← Single instance
    ├─ frontend
    ├─ backend
    └─ postgres

Backend docker-compose.prod.yml:
  backend_default (bridge)
    ├─ traefik ← Separate instance
    ├─ backend
    └─ postgres

Client docker-compose.prod.yml:
  (joins backend_default)
    └─ frontend ← No Traefik, uses existing
```

## 🎯 Recommended Workflows

### Local Development

```bash
# Terminal 1 - Start all services
cd /path/to/task1
docker-compose up

# Services available:
# - Frontend: http://localhost:3001
# - Backend: http://localhost:3000
# - DB: localhost:5432

# Make changes → See updates instantly
```

### Production Deployment (First Time)

```bash
# 1. Configure DNS
# A    flix.com       → YOUR_SERVER_IP
# A    www.flix.com   → YOUR_SERVER_IP
# A    api.flix.com   → YOUR_SERVER_IP

# 2. Set environment variables
cd /path/to/task1
cp .env.example .env
nano .env  # Edit production values

# 3. Deploy
docker-compose -f docker-compose.prod.yml up -d

# 4. Monitor SSL certificate acquisition (1-2 minutes)
docker-compose -f docker-compose.prod.yml logs -f traefik

# 5. Verify deployment
curl -I https://flix.com
curl -I https://api.flix.com/health
```

### Production Updates

```bash
# 1. Pull latest code
git pull origin main

# 2. Rebuild images
docker-compose -f docker-compose.prod.yml build

# 3. Update services (zero downtime)
docker-compose -f docker-compose.prod.yml up -d

# 4. Check health
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs --tail=50
```

### Testing Backend Changes

```bash
# Work on backend only
cd backend
docker-compose up -d

# Make changes → Auto reloads
# Test at http://localhost:3000

# When done
docker-compose down
```

### Testing Frontend Changes

```bash
# Work on frontend only (backend must be running)
cd client
docker-compose up -d

# Make changes → Auto reloads
# Test at http://localhost:3001

# When done
docker-compose down
```

## 🔒 Security Checklist

### Development

- [ ] Use different credentials than production
- [ ] Don't commit .env files
- [ ] Keep ports local only

### Production

- [ ] Configure firewall (allow 80, 443, 22 only)
- [ ] Use strong database passwords
- [ ] Change default JWT secret
- [ ] Set up automated backups
- [ ] Enable fail2ban
- [ ] Regular security updates
- [ ] Monitor logs
- [ ] Use SSH keys (disable password auth)

## 🐛 Common Issues

### Port Already in Use

```bash
# Check what's using the port
lsof -i :3000
lsof -i :3001

# Solution: Stop conflicting service or change port in .env
```

### Traefik Can't Get Certificate

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs traefik

# Common issues:
# - Ports 80/443 not accessible from internet
# - DNS not pointing to server
# - Firewall blocking ports
# - Email not configured

# Test connectivity
curl -I http://your-server-ip
```

### Frontend Can't Reach Backend

```bash
# Development: Check NEXT_PUBLIC_API_URL
docker-compose exec frontend env | grep NEXT_PUBLIC

# Production: Check network
docker network inspect task1_flix-network

# Verify backend is running
curl http://localhost:3000/health
```

### Database Connection Failed

```bash
# Check if PostgreSQL is healthy
docker-compose ps

# View PostgreSQL logs
docker-compose logs postgres

# Test connection
docker-compose exec postgres psql -U postgres -d flix_db -c "\dt"
```

## 📊 Monitoring

### View All Logs

```bash
# Development
docker-compose logs -f

# Production
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose logs -f backend
```

### Check Resource Usage

```bash
docker stats

# Shows CPU, memory, network for each container
```

### Check Service Health

```bash
docker-compose ps

# All services should show "Up" and "healthy"
```

## 🔄 Backup & Restore

### Backup Database

```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres flix_db > backup_$(date +%Y%m%d).sql

# Restore backup
docker-compose exec -T postgres psql -U postgres flix_db < backup_20240101.sql
```

### Backup Volumes

```bash
# PostgreSQL data
docker run --rm -v task1_postgres_prod_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres.tar.gz /data

# Traefik certificates
docker run --rm -v task1_traefik_letsencrypt:/data -v $(pwd):/backup alpine tar czf /backup/traefik.tar.gz /data
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Traefik Documentation](https://doc.traefik.io/traefik/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [DOCKER.md](./DOCKER.md) - Comprehensive Docker guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture

## 🆘 Getting Help

If you encounter issues:

1. Check the logs: `docker-compose logs -f [service]`
2. Verify environment variables: `docker-compose exec [service] env`
3. Check network connectivity: `docker network inspect [network]`
4. Review this guide and [DOCKER.md](./DOCKER.md)
5. Open an issue on GitHub

---

**Remember:** For production, always use **root-level `docker-compose.prod.yml`** with a single shared Traefik instance!

