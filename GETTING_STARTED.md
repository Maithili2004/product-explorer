# Getting Started Guide

This guide walks you through setting up and running Product Data Explorer locally.

## Prerequisites

Before you start, ensure you have installed:

- **Node.js** 18+ ([download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **PostgreSQL** 13+ ([download](https://www.postgresql.org/download/))
- **Redis** 7+ ([download](https://redis.io/download/))
- **Docker** & **Docker Compose** (optional, but recommended)

### Verify Installation

```bash
node --version      # Should be v18+
npm --version       # Should be 8+
psql --version      # PostgreSQL version
redis-cli --version # Redis version
docker --version    # Docker version (if using Docker)
```

## Option 1: Quick Start with Docker Compose (Recommended)

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/internshala_project.git
cd internshala_project
```

### 2. Environment Setup

```bash
# Copy environment file for backend
cp backend/.env.example backend/.env.local

# Copy environment file for frontend
cp frontend/.env.example frontend/.env.local
```

### 3. Start Services

```bash
# Start all services (PostgreSQL, Redis, Backend, Frontend)
docker-compose up -d

# Monitor logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 4. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api/v1
- **Health Check**: http://localhost:3001/health

## Option 2: Local Development Setup

### Step 1: Start Database Services

#### Using Docker (Recommended)

```bash
# Start PostgreSQL
docker run -d \
  --name postgres_dev \
  -e POSTGRES_USER=product_user \
  -e POSTGRES_PASSWORD=product_password \
  -e POSTGRES_DB=product_explorer \
  -p 5432:5432 \
  postgres:15-alpine

# Start Redis
docker run -d \
  --name redis_dev \
  -p 6379:6379 \
  redis:7-alpine
```

#### Using Local Installation

```bash
# macOS (with Homebrew)
brew services start postgresql
brew services start redis

# Ubuntu/Debian
sudo service postgresql start
sudo service redis-server start

# Windows (via Services)
# Use Windows Services app or PostgreSQL installer
```

### Step 2: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE product_explorer;
CREATE USER product_user WITH PASSWORD 'product_password';
ALTER ROLE product_user SET client_encoding TO 'utf8';
ALTER ROLE product_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE product_user SET default_transaction_deferrable TO on;
ALTER ROLE product_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE product_explorer TO product_user;

\q
```

### Step 3: Setup Backend

```bash
cd backend

# Copy and configure environment
cp .env.example .env.local

# Install dependencies
npm install

# Run migrations
npm run migrate

# (Optional) Seed database with sample data
npm run seed

# Start development server
npm run dev

# The API should be running at http://localhost:3001
```

#### Backend Environment Variables (.env.local)

```env
# Server
PORT=3001
NODE_ENV=development
LOG_LEVEL=debug

# Database
DATABASE_URL=postgresql://product_user:product_password@localhost:5432/product_explorer
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=product_user
DATABASE_PASSWORD=product_password
DATABASE_NAME=product_explorer

# Redis
REDIS_URL=redis://localhost:6379

# API
API_PREFIX=api
API_VERSION=v1
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=30

# Scraping
SCRAPING_RATE_LIMIT=2000
CACHE_TTL=3600
WOB_BASE_URL=https://www.worldofbooks.com
```

### Step 4: Setup Frontend

```bash
cd ../frontend

# Copy and configure environment
cp .env.example .env.local

# Install dependencies
npm install

# Start development server
npm run dev

# The app should be running at http://localhost:3000
```

#### Frontend Environment Variables (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 5: Verify Setup

1. **Check Backend Health**
   ```bash
   curl http://localhost:3001/health
   ```

2. **Check API**
   ```bash
   curl http://localhost:3001/api/v1/navigation
   ```

3. **Open Frontend**
   - Visit http://localhost:3000 in your browser

## Database Setup Details

### Creating Tables

The first run automatically creates tables:

```bash
# From backend directory
npm run migrate
```

### Seeding Sample Data

```bash
npm run seed
```

This creates:
- Sample navigations (Books, Categories, etc.)
- Sample categories with hierarchy
- Sample products with reviews

### Database Inspection

```bash
# Connect to database
psql -U product_user -d product_explorer

# List tables
\dt

# View table structure
\d navigation
\d category
\d product
\d product_detail
\d review
\d scrape_job
\d view_history

# Exit
\q
```

## Development Workflow

### Backend Development

```bash
cd backend

# Start with hot-reload
npm run dev

# Run tests
npm run test

# Run with coverage
npm run test:cov

# Lint code
npm run lint

# Format code
npm run format

# Build for production
npm run build

# Start production build
npm run start
```

### Frontend Development

```bash
cd frontend

# Start dev server with hot-reload
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format

# Type checking
npm run type-check
```

### Common Tasks

```bash
# Restart backend database
npm run migrate:revert && npm run migrate

# Reset database completely
dropdb -U product_user product_explorer
createdb -U product_user product_explorer
npm run migrate
npm run seed

# View database logs
# PostgreSQL (in new terminal)
tail -f /usr/local/var/log/postgres.log  # macOS
tail -f /var/log/postgresql/postgresql.log # Linux

# View Redis
redis-cli monitor
```

## Troubleshooting

### PostgreSQL Connection Issues

```bash
# Test connection
psql -U product_user -h localhost -d product_explorer -c "SELECT 1"

# Check if PostgreSQL is running
pg_isready -h localhost

# Reset password if forgotten
psql -U postgres
ALTER USER product_user WITH PASSWORD 'product_password';
```

### Redis Connection Issues

```bash
# Test Redis connection
redis-cli ping
# Should output: PONG

# Check Redis info
redis-cli info

# Clear Redis cache
redis-cli FLUSHALL
```

### Backend Not Starting

```bash
# Check logs
npm run dev

# Common issues:
# 1. Port 3001 already in use
lsof -i :3001
kill -9 <PID>

# 2. Database not running
# See PostgreSQL Connection Issues above

# 3. Redis not running
redis-server
```

### Frontend Build Issues

```bash
# Clear cache and reinstall
rm -rf frontend/node_modules frontend/.next
cd frontend
npm install
npm run dev

# Check Node version compatibility
node --version  # Should be 18+
```

### API Errors

```bash
# Check backend is running
curl http://localhost:3001/health

# Check CORS configuration
# Frontend should be listed in CORS_ORIGIN env var

# Check database is accessible
curl http://localhost:3001/api/v1/navigation
```

## Code Quality

### Linting

```bash
# Backend
cd backend && npm run lint

# Frontend
cd frontend && npm run lint
```

### Formatting

```bash
# Backend
cd backend && npm run format

# Frontend
cd frontend && npm run format
```

### Type Checking

```bash
# Backend - Built into tsc
cd backend && npm run build

# Frontend
cd frontend && npm run type-check
```

### Testing

```bash
# Backend unit tests
cd backend && npm run test

# Backend e2e tests
cd backend && npm run test:e2e

# Frontend tests (if configured)
cd frontend && npm run test
```

## Git Workflow

### Clone and Setup

```bash
# Clone with SSH (recommended)
git clone git@github.com:yourusername/internshala_project.git

# Clone with HTTPS
git clone https://github.com/yourusername/internshala_project.git

cd internshala_project
```

### Feature Development

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create Pull Request on GitHub
```

### Code Review Checklist

- [ ] Code follows project style guide
- [ ] Tests pass locally
- [ ] No console errors or warnings
- [ ] Database migrations applied
- [ ] Environment variables documented
- [ ] Types are correct (TypeScript)
- [ ] Accessibility standards met
- [ ] Performance impact considered

## Production Build

### Backend

```bash
cd backend

# Build
npm run build

# Start production server
npm run start
```

### Frontend

```bash
cd frontend

# Build (generates .next folder)
npm run build

# Start production server
npm start
```

## Performance Tips

1. **Enable Caching**
   - Set `CACHE_TTL` appropriately in backend
   - Clear Redis if data seems stale: `redis-cli FLUSHALL`

2. **Database Optimization**
   - Use indexes on frequently queried columns
   - Monitor slow queries: `EXPLAIN ANALYZE ...`

3. **Frontend Performance**
   - Use Next.js Image component for optimization
   - Enable dynamic imports for large components
   - Check bundle size: `npm run build` and check `.next/static`

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Redis Documentation](https://redis.io/docs)
- [Crawlee Documentation](https://crawlee.dev)

## Getting Help

1. Check existing GitHub issues
2. Review error logs in terminal
3. Check database connectivity
4. Verify environment variables
5. Open a new GitHub issue with:
   - Steps to reproduce
   - Error message
   - System information (OS, Node version, etc.)
   - Relevant logs

## Next Steps

After setup:

1. Explore the codebase
2. Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
3. Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API details
4. Make your first commit!

Happy coding! 🚀
