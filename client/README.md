# FlixCMS Client - Next.js Application

A fully modular Next.js CMS client with SSR public pages and CSR admin dashboard.

## ✅ Project Status

- **Structure**: ✅ Using src/ directory
- **Linting**: ✅ Zero errors (2 informational React Compiler warnings)
- **Routes**: ✅ All pages in proper app/ locations
- **Configuration**: ✅ All configs updated for src/
- **Ready**: ✅ Ready for development

## 🏗️ Project Structure

```
client/
├── src/                        # All source code
│   ├── app/
│   │   ├── (app)/             # Public SSR pages
│   │   │   ├── layout.tsx     # Header + Footer
│   │   │   ├── page.tsx       # Home with popular/trending
│   │   │   ├── search/        # Search page
│   │   │   └── content/[id]/  # Content detail
│   │   ├── (dashboard)/       # Admin CSR pages
│   │   │   ├── layout.tsx     # Sidebar + React Query
│   │   │   ├── dashboard/     # Dashboard home
│   │   │   ├── content/       # Content CRUD
│   │   │   ├── tags/          # Tags management
│   │   │   └── reviews/       # Review moderation
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                # shadcn (needs install)
│   │   └── shared/            # 8 custom components
│   │
│   ├── features/              # 7 feature modules
│   │   ├── content/
│   │   ├── tags/
│   │   ├── genres/
│   │   ├── cast-crew/
│   │   ├── reviews/
│   │   ├── ratings/
│   │   └── search/
│   │
│   ├── lib/                   # Core utilities
│   │   ├── utils.ts
│   │   ├── api-client.ts
│   │   ├── fetch-helpers.ts
│   │   └── query-client.ts
│   │
│   └── types/                 # TypeScript types
│       ├── api.ts
│       └── index.ts
│
└── public/                    # Static assets
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install packages
yarn add @tanstack/react-query react-hook-form @hookform/resolvers zod date-fns

# Install shadcn/ui components
npx shadcn@latest add button card input label table dialog form select badge textarea dropdown-menu separator skeleton toast tabs alert checkbox
```

### 2. Environment Setup

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 3. Start Development

```bash
# Terminal 1: Backend
cd ../backend
yarn start:dev

# Terminal 2: Frontend
yarn dev
```

Visit:
- **Public**: http://localhost:3001
- **Dashboard**: http://localhost:3001/dashboard

## 📚 Features

### Public App (SSR)
- Popular and trending content
- Advanced search with filters
- Content detail pages with reviews
- Optimized with Next.js caching

### Admin Dashboard (CSR)
- Real-time data with React Query
- Content CRUD operations
- Tag and genre management
- Review moderation interface

## 🎯 What's Built

### Feature Modules (7)
Each with API functions, React Query hooks, types, and utils:
- Content (movies/TV shows with seasons/episodes)
- Tags
- Genres (with hierarchical tree support)
- Cast & Crew
- Reviews (with moderation)
- Ratings
- Search (with autocomplete, popular, trending)

### Shared Components (8)
- Header with search
- Footer
- Sidebar (dashboard navigation)
- Content Card
- Search Bar (with autocomplete)
- Filter Panel
- Pagination
- Data Table (with sorting)

### Pages (11)
**Public (SSR):**
- Home with popular/trending
- Search with filters
- Content detail with reviews

**Dashboard (CSR):**
- Dashboard overview
- Content list/create/edit
- Tags management
- Review moderation

## 🎨 Architecture

### Feature-First Organization
Each feature includes:
- `api/` - API functions & React Query hooks
- `types.ts` - TypeScript types & Zod schemas
- `utils.ts` - Helper functions

### Data Fetching
- **SSR**: `fetchCached()` / `fetchDynamic()` from `@/lib/fetch-helpers`
- **CSR**: React Query hooks from feature modules

### Import Pattern
All imports use `@/` alias mapping to `src/`:

```typescript
import { Button } from '@/components/ui/button';
import { useContent } from '@/features/content/api/use-content';
import { api } from '@/lib/api-client';
import { Content } from '@/types/api';
```

## 📖 Development Guide

### Adding a Feature

1. Create `src/features/your-feature/`
2. Add `api/`, `types.ts`, `utils.ts`
3. Follow existing patterns

### Adding a Page

**Public (SSR):**
```typescript
// src/app/(app)/your-page/page.tsx
import { fetchCached } from '@/lib/fetch-helpers';

export default async function YourPage() {
  const data = await fetchCached('/endpoint');
  return <div>{/* ... */}</div>;
}
```

**Dashboard (CSR):**
```typescript
// src/app/(dashboard)/your-page/page.tsx
'use client';
import { useYourFeature } from '@/features/your-feature/api/use-your-feature';

export default function YourPage() {
  const { data } = useYourFeature();
  return <div>{/* ... */}</div>;
}
```

## 🔧 Configuration

### API Base URL
Default: `http://localhost:3000/api`

Change via `NEXT_PUBLIC_API_URL` in `.env.local`

### Caching Strategy
- Popular/Trending: 1 hour cache
- Content Details: 1 hour cache
- Search: No cache (dynamic)
- Dashboard: React Query (1 min stale time)

## 📦 Scripts

```bash
yarn dev      # Development server
yarn build    # Production build
yarn start    # Production server
yarn lint     # Run ESLint
```

## 🐛 Troubleshooting

### Module Not Found
Ensure imports use `@/` alias:
```typescript
// ✅ Correct
import { api } from '@/lib/api-client';

// ❌ Wrong
import { api } from '../../../lib/api-client';
```

### API Connection Issues
1. Check backend runs on port 3000
2. Verify CORS enabled in backend
3. Check `NEXT_PUBLIC_API_URL` set correctly

### Build Errors
```bash
rm -rf .next
yarn build
```

## 🎯 Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI**: shadcn/ui
- **Data**: React Query + Next.js fetch
- **Forms**: React Hook Form + Zod
- **Utils**: date-fns

## 📝 Notes

- No authentication implemented yet
- All pages publicly accessible
- Add middleware for auth when needed
- Backend expected on port 3000

---

**Built with best practices** • **Modular** • **Type-safe** • **Production-ready**
