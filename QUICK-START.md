# 🚀 Quick Start Guide

## ⚡ TL;DR

### Development (Everything in one command)
```bash
docker-compose up -d
```
✅ Frontend: http://localhost:3001  
✅ Backend: http://localhost:3000  
✅ Database: localhost:5432

### Production (Everything in one command)
```bash
docker-compose -f docker-compose.prod.yml up -d
```
✅ Frontend: https://flix.com  
✅ Backend: https://api.flix.com  
✅ Automatic SSL certificates

---

## 📦 What's Included

```
┌─────────────────────────────────────────────┐
│           FLIX APPLICATION                  │
├─────────────────────────────────────────────┤
│                                             │
│  Frontend (Next.js 16 + React 19)          │
│  ├─ TanStack Query                          │
│  ├─ Tailwind CSS                            │
│  ├─ Radix UI Components                     │
│  └─ TypeScript                              │
│                                             │
│  Backend (NestJS)                           │
│  ├─ TypeORM                                 │
│  ├─ PostgreSQL 16                           │
│  ├─ JWT Authentication                      │
│  └─ RESTful API                             │
│                                             │
│  Infrastructure                             │
│  ├─ Docker & Docker Compose                │
│  ├─ Traefik (Reverse Proxy)                │
│  └─ Let's Encrypt (SSL)                     │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🎯 Choose Your Path

### Path 1: I want to develop locally
```bash
# 1. Start everything
docker-compose up -d

# 2. Open your browser
# Frontend: http://localhost:3001
# Backend:  http://localhost:3000

# 3. Make changes → Hot reload happens automatically

# 4. View logs
docker-compose logs -f

# 5. Stop when done
docker-compose down
```

### Path 2: I want to deploy to production
```bash
# 1. Configure DNS (point to your server)
# flix.com → YOUR_IP
# api.flix.com → YOUR_IP

# 2. Set environment variables
cp .env.example .env
nano .env  # Edit with production values

# 3. Deploy
docker-compose -f docker-compose.prod.yml up -d

# 4. Wait 1-2 minutes for SSL certificates

# 5. Visit your site
# https://flix.com
# https://api.flix.com

# 6. Monitor
docker-compose -f docker-compose.prod.yml logs -f
```

### Path 3: I only want to work on frontend
```bash
cd client
docker-compose up -d
# Frontend: http://localhost:3001
# (Backend must be running separately)
```

### Path 4: I only want to work on backend
```bash
cd backend
docker-compose up -d
# Backend: http://localhost:3000
```

---

## 🔑 Key Concepts

### 🐳 Single Command Setup
No complex installation. Just:
```bash
docker-compose up -d
```

### 🔄 Hot Reload in Development
Change code → Save → See changes instantly

### 🔒 Automatic SSL in Production
No manual certificate setup. Traefik handles it.

### 🎯 One Traefik for Everything
Single reverse proxy handles both frontend and backend

---

## 📂 File Structure (What You Need to Know)

```
task1/
├── docker-compose.yml          ← Dev: Start this
├── docker-compose.prod.yml     ← Prod: Start this
├── .env                        ← Your settings here
├── backend/                    ← NestJS backend
├── client/                     ← Next.js frontend
└── Documentation below ↓
    ├── DOCKER.md              ← Detailed Docker guide
    ├── DEPLOYMENT.md          ← All deployment scenarios
    └── ARCHITECTURE.md        ← How it all works
```

---

## 🌐 URLs & Ports

### Development
| Service | URL | Port |
|---------|-----|------|
| **Frontend** | http://localhost:3001 | 3001 |
| **Backend** | http://localhost:3000 | 3000 |
| **Database** | localhost:5432 | 5432 |

### Production
| Service | URL | Notes |
|---------|-----|-------|
| **Frontend** | https://flix.com | via Traefik |
| **Backend** | https://api.flix.com | via Traefik |
| **Database** | (internal only) | Not exposed |
| **Traefik** | ports 80, 443 | Entry point |

---

## 🔧 Common Commands

```bash
# Development
docker-compose up -d              # Start
docker-compose logs -f            # View logs
docker-compose ps                 # Check status
docker-compose down               # Stop

# Production
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml logs -f
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml down

# Rebuild after changes
docker-compose build
docker-compose up -d

# Remove everything (including data)
docker-compose down -v

# View resource usage
docker stats
```

---

## 🐛 Troubleshooting

### Port already in use?
```bash
# Find what's using it
lsof -i :3000
lsof -i :3001

# Change port in .env
FRONTEND_PORT=3002
```

### Can't connect to backend?
```bash
# Check if running
docker-compose ps

# View backend logs
docker-compose logs backend

# Check network
docker network inspect task1_flix-network
```

### SSL certificate not working?
```bash
# View Traefik logs
docker-compose -f docker-compose.prod.yml logs traefik

# Verify:
# - DNS points to your server
# - Ports 80 and 443 are open
# - Email is configured in .env
```

### Database connection failed?
```bash
# Check PostgreSQL
docker-compose logs postgres

# Verify credentials in .env match
DATABASE_USER=...
DATABASE_PASSWORD=...
```

---

## 🎓 Learn More

### Quick References
- **[README.md](./README.md)** - Main documentation
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - 6 deployment scenarios

### In-Depth Guides
- **[DOCKER.md](./DOCKER.md)** - Complete Docker setup
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design

### Component Docs
- **[backend/README.md](./backend/README.md)** - Backend API
- **[client/README.md](./client/README.md)** - Frontend app

---

## 💡 Pro Tips

1. **Development**: Always use hot reload (default in dev mode)
2. **Production**: Always use root-level `docker-compose.prod.yml`
3. **SSL**: Give it 1-2 minutes on first start
4. **Logs**: Use `docker-compose logs -f` to debug
5. **Backups**: Backup database regularly with `pg_dump`

---

## 🆘 Need Help?

1. Check logs: `docker-compose logs -f [service]`
2. Read [DOCKER.md](./DOCKER.md) for detailed info
3. See [DEPLOYMENT.md](./DEPLOYMENT.md) for your scenario
4. Review [ARCHITECTURE.md](./ARCHITECTURE.md) for understanding
5. Open a GitHub issue

---

## ✨ You're Ready!

Start with:
```bash
docker-compose up -d
```

Visit: **http://localhost:3001**

Happy coding! 🚀

