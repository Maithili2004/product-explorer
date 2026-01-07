# System Architecture

## Overview

Product Data Explorer is a modern full-stack web application built with:
- **Frontend**: Next.js 14 (React) with TypeScript and Tailwind CSS
- **Backend**: NestJS with Node.js and TypeScript
- **Database**: PostgreSQL for persistent storage
- **Cache**: Redis for performance optimization
- **Scraping**: Crawlee + Playwright for ethical web scraping

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Browser                          │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │   Vercel    │
                    │  (Frontend) │
                    │  Next.js    │
                    └──────┬──────┘
                           │ HTTPS
                    ┌──────▼──────────────────┐
                    │   API Gateway/Load      │
                    │   Balancer              │
                    └──────┬──────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐   ┌────────▼────────┐   ┌────▼────┐
   │ Railway │   │   Load Balancer │   │ Fly.io  │
   │(Backend)│   │                 │   │(Backend)│
   │ NestJS  │   │   (Optional)    │   │ NestJS  │
   │ Cluster │   └─────────────────┘   │ Cluster │
   └────┬────┘                          └────┬────┘
        │                                    │
        └────────────────┬───────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────▼─────┐   ┌─────▼─────┐  ┌──────▼──────┐
   │PostgreSQL│   │   Redis   │  │ World of    │
   │ Database │   │   Cache   │  │ Books Site  │
   └──────────┘   └───────────┘  └─────────────┘
```

## Directory Structure

```
internshala_project/
├── backend/                          # NestJS API Server
│   ├── src/
│   │   ├── app.module.ts            # Root module
│   │   ├── main.ts                  # Entry point
│   │   ├── modules/
│   │   │   ├── health/              # Health check endpoints
│   │   │   ├── navigation/          # Navigation management
│   │   │   ├── categories/          # Category management
│   │   │   ├── products/            # Product management
│   │   │   └── scraping/            # Web scraping service
│   │   ├── database/
│   │   │   ├── entities/            # TypeORM entities
│   │   │   ├── migrations/          # Database migrations
│   │   │   └── seeders/             # Database seeders
│   │   ├── common/
│   │   │   ├── decorators/          # Custom decorators
│   │   │   ├── exceptions/          # Custom exceptions
│   │   │   └── filters/             # Exception filters
│   │   └── config/                  # Configuration files
│   ├── test/                        # Test files
│   ├── Dockerfile                   # Docker configuration
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                         # Next.js React App
│   ├── src/
│   │   ├── app/                     # App Router pages
│   │   │   ├── layout.tsx           # Root layout
│   │   │   ├── page.tsx             # Home page
│   │   │   ├── about/page.tsx       # About page
│   │   │   ├── categories/[id]/     # Category pages
│   │   │   └── products/[id]/       # Product detail pages
│   │   ├── components/              # React components
│   │   │   ├── layout/              # Layout components
│   │   │   └── ui/                  # UI components
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── store/                   # Zustand state management
│   │   ├── utils/                   # Utility functions
│   │   ├── types/                   # TypeScript types
│   │   └── styles/                  # CSS stylesheets
│   ├── public/                      # Static assets
│   ├── Dockerfile                   # Docker configuration
│   ├── next.config.js               # Next.js configuration
│   ├── tailwind.config.ts           # Tailwind configuration
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml               # Multi-container setup
├── .github/
│   └── workflows/
│       └── ci-cd.yml                # GitHub Actions pipeline
├── README.md                        # Project documentation
├── API_DOCUMENTATION.md             # API reference
├── DEPLOYMENT.md                    # Deployment guide
└── ARCHITECTURE.md                  # This file
```

## Data Flow

### 1. User Navigation Flow

```
User clicks navigation heading
         │
         ▼
Frontend component triggers
API request via SWR hook
         │
         ▼
Backend receives GET /navigation
         │
         ▼
Service queries PostgreSQL
(with Redis cache layer)
         │
         ▼
Returns navigation data
         │
         ▼
Frontend renders categories
```

### 2. Product Scraping Flow

```
User clicks "View More" or
    Scrape button
         │
         ▼
Frontend triggers
POST /scraping/category/scrape
         │
         ▼
Backend creates ScrapeJob
with status: PENDING
         │
         ▼
Job queued in Redis queue
(BullMQ)
         │
         ▼
Worker process picks up job
ScraperService executes
Crawlee + Playwright scraper
         │
         ▼
Extracts product data
Computes content hash for
deduplication
         │
         ▼
Saves to PostgreSQL
Updates ScrapeJob status:
COMPLETED/FAILED
         │
         ▼
Frontend polls job status
and refreshes product list
```

### 3. Caching Strategy

```
Frontend Request
         │
         ▼
SWR hook checks cache
(in-memory + localStorage)
         │
         ▼
If valid: Return cached data
If stale: Fetch from API
         │
         ▼
Backend receives request
         │
         ▼
Check Redis cache
         │
         ├─ HIT ──────────────┐
         │                    │
         ├─ MISS ──┐          │
         │         ▼          │
         │      Query DB      │
         │         │          │
         │         ▼          │
         │      Cache in      │
         │      Redis         │
         │      (1 hour TTL)  │
         │         │          │
         └────────►│◄─────────┘
                   │
                   ▼
            Return to Frontend
```

## Key Design Decisions

### 1. NestJS for Backend

**Why:** 
- Enterprise-grade framework with excellent TypeScript support
- Modular architecture scales well
- Built-in dependency injection and middleware system
- Strong typing prevents runtime errors
- Excellent testing utilities

### 2. PostgreSQL Database

**Why:**
- ACID compliance for data integrity
- Excellent JSON support for flexible specs
- Rich query capabilities with indexes
- Mature ecosystem and tools
- Free and open-source

### 3. Redis for Caching

**Why:**
- In-memory performance (100-1000x faster than DB)
- Simple key-value model for cache management
- Built-in expiry (TTL) for automatic cleanup
- Easy rate limiting implementation
- Session management support

### 4. BullMQ for Job Queuing

**Why:**
- Non-blocking background jobs prevent HTTP timeouts
- Automatic retry with exponential backoff
- Persistent queue survives crashes
- Built-in rate limiting
- Redis-based, zero additional infrastructure

### 5. Crawlee + Playwright for Scraping

**Why:**
- Handles dynamic JavaScript-heavy sites
- Built-in request queuing and rate limiting
- Easy to set up headless browser scraping
- Active community and good documentation
- Cookie and session management

### 6. Next.js 14 with App Router

**Why:**
- Server and client components for flexibility
- Built-in optimizations (image, code splitting)
- Excellent performance with streaming
- App Router enables modern patterns
- Great developer experience with hot reload

### 7. Zustand for State Management

**Why:**
- Minimal boilerplate compared to Redux
- Simple API for persistence
- Works perfectly with localStorage
- Perfect for navigation history tracking
- Zero dependencies

### 8. SWR for Data Fetching

**Why:**
- Built-in caching and revalidation
- Automatic request deduplication
- Focus on staleness instead of loading state
- Optimistic UI updates
- Excellent performance

## Database Schema

### Entities

1. **Navigation**
   - Represents top-level categories
   - Scraped from World of Books homepage

2. **Category**
   - Hierarchical structure (parent/children)
   - Linked to navigation
   - Tracks product count

3. **Product**
   - Core product entity
   - Stores basic info (title, price, image)
   - Links to category and details

4. **ProductDetail**
   - One-to-one with Product
   - Stores rich metadata (description, reviews count)
   - Optimizes queries by separating concerns

5. **Review**
   - One-to-many with Product
   - Stores user reviews and ratings

6. **ScrapeJob**
   - Tracks all scraping operations
   - Audit trail and error logging
   - Enables job status monitoring

7. **ViewHistory**
   - Tracks user navigation
   - Stores session information
   - Enables recommendations (future)

### Key Indexes

```
- Navigation: (slug), (lastScrapedAt)
- Category: (navigationId), (parentId), (slug), (lastScrapedAt)
- Product: (sourceId UNIQUE), (categoryId), (lastScrapedAt), (sourceUrl UNIQUE)
- Review: (productId), (createdAt)
- ScrapeJob: (status), (createdAt), (targetType)
- ViewHistory: (sessionId), (createdAt)
```

## Security Architecture

```
┌─────────────────────────────────────────┐
│         Client (Browser)                │
└──────────────────┬──────────────────────┘
                   │
              HTTPS/TLS
                   │
        ┌──────────▼──────────┐
        │   API Gateway       │
        │ • Rate Limiting     │
        │ • CORS Validation   │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────────────────┐
        │   NestJS Application            │
        │ • Input Validation (DTOs)       │
        │ • Auth/Authorization (future)   │
        │ • Exception Handling            │
        └──────────┬──────────────────────┘
                   │
        ┌──────────▼──────────────────────┐
        │   Database Connection           │
        │ • Connection Pooling            │
        │ • Parameterized Queries         │
        │ • No Public Access              │
        └─────────────────────────────────┘
```

## Performance Optimization

### Frontend
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Client-side caching with localStorage
- SWR for smart data fetching

### Backend
- Database indexing on frequently queried columns
- Redis caching layer with TTL
- Query optimization with relations
- Connection pooling for database

### Infrastructure
- CDN for static assets (Vercel/Railway)
- Load balancing for horizontal scaling
- Compression (gzip) for responses
- Connection keep-alive

## Monitoring & Observability

### Logging

```
Backend:
├── Pino logger with structured JSON
├── Console output in development
├── File logging in production
└── Log levels: error, warn, info, debug

Frontend:
├── Browser console
├── Error tracking (Sentry - optional)
└── Performance monitoring (optional)
```

### Metrics

- Scraping job success/failure rates
- Average scraping time
- Cache hit rates
- API response times
- Database query performance

## Scalability Considerations

### Horizontal Scaling

```
Load Balancer
    │
    ├─ Backend Instance 1 ──┐
    ├─ Backend Instance 2 ───┼─ Shared PostgreSQL
    ├─ Backend Instance 3 ──┤ Shared Redis
    └─ Backend Instance N ──┘
```

### Database Optimization

- Implement read replicas for scaling reads
- Connection pooling with PgBouncer
- Partitioning by category for very large datasets
- Query result caching in Redis

### Job Queue Scalability

- Multiple worker instances process queue
- Auto-scaling based on queue depth
- Priority queues for different scrape types

## Future Enhancements

1. **Search & Filters**
   - Full-text search with PostgreSQL or Elasticsearch
   - Advanced filtering (price range, ratings, etc.)

2. **Recommendations**
   - Content-based similarity engine
   - Collaborative filtering

3. **User Accounts**
   - Authentication and authorization
   - Wishlists and bookmarks
   - Personalized history

4. **Advanced Analytics**
   - Trending products
   - Popular categories
   - Search trends

5. **Mobile App**
   - React Native for iOS/Android
   - Offline-first architecture

## Disaster Recovery

### Database Backups
- Automated daily backups
- Point-in-time recovery
- Replicas in different regions (optional)

### Infrastructure
- Infrastructure as Code (Terraform)
- Automated deployments
- Health checks and auto-healing
- Blue-green deployments

### Data Validation
- Constraint checks
- Referential integrity
- Data consistency audits

## Compliance

- GDPR ready (optional user data deletion)
- Robots.txt compliance for scraping
- Rate limiting to respect target site
- Ethical data collection practices
