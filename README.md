# Product Data Explorer

A production-minded full-stack web application that enables users to explore products through navigation headings, categories, and product detail pages powered by live, on-demand web scraping from World of Books.

## Architecture Overview

### Tech Stack

**Frontend:**
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS
- SWR (for client-side data fetching)

**Backend:**
- NestJS
- Node.js
- PostgreSQL (primary database)
- Redis (optional caching layer)
- Crawlee + Playwright (web scraping)

**Infrastructure:**
- Docker & Docker Compose
- GitHub Actions (CI/CD)

## Project Structure

```
internshala_project/
├── backend/              # NestJS API
│   ├── src/
│   │   ├── modules/
│   │   │   ├── scraping/
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── navigation/
│   │   │   └── health/
│   │   ├── common/
│   │   ├── config/
│   │   └── main.ts
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── frontend/             # Next.js App
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (recommended)
- PostgreSQL (if running locally without Docker)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd internshala_project
   ```

2. **Setup using Docker Compose (Recommended)**
   ```bash
   docker-compose up -d
   ```
   This will start:
   - PostgreSQL on port 5432
   - Backend API on port 3001
   - Frontend on port 3000

3. **Local Setup (Without Docker)**

   **Backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env.local
   npm run migrate
   npm run seed
   npm run dev
   ```

   **Frontend:**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   npm run dev
   ```

### Environment Variables

**Backend (.env.local):**
```
DATABASE_URL=postgresql://user:password@localhost:5432/product_explorer
REDIS_URL=redis://localhost:6379
NODE_ENV=development
LOG_LEVEL=debug
SCRAPING_RATE_LIMIT=2000
CACHE_TTL=3600
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Core Features

### Landing Page
- Displays all navigation headings scraped from World of Books
- Smooth transitions to category drilldown
- Responsive grid layout

### Category Drilldown
- Navigate through hierarchical categories
- Product count indicators
- Pagination support

### Product Grid
- Display scraped products with pagination/limit
- Product cards with image, title, price, author
- Responsive grid (3 cols desktop, 2 cols tablet, 1 col mobile)
- Loading skeleton states

### Product Detail Page
- Full product description
- User reviews and ratings
- Related/recommended products
- Additional metadata (Publisher, ISBN, Publication Date)
- Breadcrumb navigation

### About & Contact
- Project information
- Contact form (optional)
- README embedded

## API Endpoints

### Navigation
- `GET /api/v1/navigation` - Get all navigation headings
- `POST /api/v1/navigation/scrape` - Trigger navigation scrape

### Categories
- `GET /api/v1/categories` - Get categories with optional filtering
- `GET /api/v1/categories/:id` - Get category details with subcategories
- `POST /api/v1/categories/scrape` - Trigger category scrape

### Products
- `GET /api/v1/products` - Get products with pagination and filters
- `GET /api/v1/products/:id` - Get product details
- `POST /api/v1/products/scrape` - Trigger on-demand product scrape
- `GET /api/v1/products/:id/related` - Get related products

### Scraping Jobs
- `GET /api/v1/scraping/jobs` - Get scraping job history
- `GET /api/v1/scraping/jobs/:id` - Get job details
- `POST /api/v1/scraping/jobs/:id/cancel` - Cancel running job

### Health
- `GET /api/health` - Health check endpoint

## Design Decisions

### 1. Database Schema
- **Normalized schema** with proper relationships for efficient querying
- **Composite indexes** on source_id, last_scraped_at, and source_url
- **Unique constraints** to prevent duplicate scrapes
- **View history** table to persist browsing history

### 2. Scraping Architecture
- **Queue-based worker model** using BullMQ to prevent blocking
- **Rate limiting** with exponential backoff (2s base, 60s max)
- **Deduplication** based on source_id and content hash
- **Cache expiry** (configurable, default 1 hour)
- **Idempotent jobs** with retry logic

### 3. Frontend Data Fetching
- **SWR** with revalidation strategy for optimal UX
- **Client-side caching** with localStorage for navigation history
- **Optimistic UI updates** where applicable
- **Error boundaries** for graceful fallbacks

### 4. Security
- Environment variables for all secrets (no hardcoded values)
- Input sanitization with `joi` validation
- CORS properly configured
- Rate limiting on API endpoints (30 req/min per IP)
- Request validation middleware

### 5. Performance
- Database indexing for common queries
- Redis caching layer for frequently accessed data
- Image optimization with Next.js Image component
- Lazy loading for product lists
- Code splitting in frontend

### 6. Observability
- Structured logging with Winston
- Error tracking with custom error handler
- Metrics collection for scraping performance
- Graceful error messages to users

## Scraping Notes

### Ethical Scraping
- Respects robots.txt guidelines
- 2-5 second delays between requests
- Exponential backoff on rate limiting
- Caches results for 1 hour by default
- Daily quota limit to prevent overload

### Deduplication Strategy
1. Check source_id + URL combination
2. Compute content hash of extracted data
3. Skip if hash matches recent entry (< 1 hour)
4. Update last_scraped_at timestamp

### Cache Invalidation
- Automatic expiry after 1 hour (configurable)
- Manual refresh via "Re-scrape" button
- Smart refresh: only re-scrape if source has changed

## Testing

```bash
# Backend
cd backend
npm run test
npm run test:e2e

# Frontend
cd frontend
npm run test
npm run test:e2e
```

## Documentation

### Quick Links

- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Step-by-step setup guide for local development
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API reference with examples
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design and technical decisions
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **[CHECKLIST.md](./CHECKLIST.md)** - Feature completion checklist

## Deployment

### Prerequisites
- GitHub repo (public or private)
- Vercel account (frontend)
- Railway/Render/Fly.io account (backend)

### Deployment Instructions

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### CI/CD Pipeline

GitHub Actions workflow automatically:
- Lints code on push
- Runs tests
- Builds Docker images
- Deploys to production on merge to main

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env.local
- Run `npm run migrate` if migrations fail

### Scraping Failures
- Check website availability at https://www.worldofbooks.com/
- Review logs: `docker logs <backend-container-id>`
- Verify rate limiting isn't triggered

### Frontend Build Issues
- Clear .next directory: `rm -rf frontend/.next`
- Reinstall dependencies: `rm -rf frontend/node_modules && npm install`

## Contributing

1. Create a feature branch
2. Make changes
3. Run tests and linting
4. Submit pull request

## License

MIT License - See LICENSE file for details

## Contact

For questions or issues, please open a GitHub issue or contact the development team.
