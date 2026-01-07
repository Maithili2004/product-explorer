# Quick Reference Guide

## Project Commands

### Backend

```bash
# Development
cd backend && npm run dev          # Start dev server with hot reload
npm run build                       # Build for production
npm run start                       # Start production build
npm run lint                        # Run linter
npm run format                      # Format code with Prettier
npm run test                        # Run tests
npm run test:cov                   # Run tests with coverage
npm run test:e2e                   # Run e2e tests
npm run migrate                     # Run database migrations
npm run seed                        # Seed database with sample data
```

### Frontend

```bash
# Development
cd frontend && npm run dev         # Start dev server with hot reload
npm run build                      # Build for production
npm start                          # Start production build
npm run lint                       # Run linter
npm run format                     # Format code with Prettier
npm run type-check                 # Run TypeScript check
npm run test                       # Run tests
npm run test:e2e                  # Run e2e tests
```

### Docker

```bash
# Full stack
docker-compose up -d               # Start all services
docker-compose down                # Stop all services
docker-compose logs -f             # View logs
docker-compose ps                  # List running services

# Individual services
docker-compose up -d postgres      # Start only PostgreSQL
docker-compose restart backend     # Restart backend service
docker-compose exec backend npm run migrate  # Run migrations in container
```

## API Endpoints

### Base URL
```
http://localhost:3001/api/v1
```

### Quick Navigation

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/navigation` | GET | List all navigations |
| `/categories` | GET | List categories |
| `/categories/:id` | GET | Get category details |
| `/products` | GET | List products (paginated) |
| `/products/:id` | GET | Get product details |
| `/products/:id/reviews` | GET | Get product reviews |
| `/health` | GET | Health check |

For full API details, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Environment Variables

### Backend (.env.local)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/product_explorer
REDIS_URL=redis://localhost:6379
NODE_ENV=development
PORT=3001
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Directory Structure Quick Reference

```
backend/
├── src/
│   ├── modules/          # Feature modules
│   ├── database/         # Entities, migrations, seeders
│   ├── config/           # Configuration
│   └── common/           # Shared utilities
└── test/               # Test files

frontend/
├── src/
│   ├── app/            # Pages and layouts
│   ├── components/     # React components
│   ├── hooks/          # Custom hooks
│   ├── store/          # Zustand state
│   ├── utils/          # Utilities
│   └── types/          # TypeScript types
└── public/            # Static assets
```

## Debugging

### Backend

```bash
# Debug with VSCode
# 1. Add this to launch.json:
{
  "type": "node",
  "request": "launch",
  "name": "Debug NestJS",
  "program": "${workspaceFolder}/backend/node_modules/.bin/nest",
  "args": ["start", "--debug"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}

# 2. Set breakpoints and press F5

# Or use node debugger
node --inspect-brk ./node_modules/.bin/nest start
# Then open chrome://inspect
```

### Frontend

```bash
# Use VSCode debugger
# Or Chrome DevTools (F12)
# React DevTools browser extension recommended
```

### Database

```bash
# Connect to PostgreSQL
psql -U product_user -d product_explorer

# Check tables
\dt

# View table structure
\d product

# Exit
\q

# Or use pgAdmin (optional)
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port 3001 already in use | `lsof -i :3001` → `kill -9 <PID>` |
| Database connection failed | Check DATABASE_URL, ensure PostgreSQL running |
| Redis connection failed | Check REDIS_URL, ensure Redis running |
| API returns 404 | Check endpoint path, ensure backend is running |
| Frontend not connecting to API | Check NEXT_PUBLIC_API_URL env var |
| Database migration fails | `npm run migrate:revert` then `npm run migrate` |
| Tests failing | Clear cache: `npm run test -- --clearCache` |

## Performance Tips

1. **Check API response times**
   ```bash
   curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3001/api/v1/navigation
   ```

2. **Monitor database**
   ```sql
   SELECT query, calls, mean_time FROM pg_stat_statements
   ORDER BY mean_time DESC LIMIT 10;
   ```

3. **Check cache effectiveness**
   ```bash
   redis-cli INFO stats
   ```

4. **Bundle analysis (frontend)**
   ```bash
   npm run build
   # Check .next/static size
   ```

## Git Workflow

```bash
# Feature development
git checkout -b feature/my-feature
git add .
git commit -m "feat: description"
git push origin feature/my-feature

# Code review & merge (create PR on GitHub)

# Keep updated
git fetch origin
git rebase origin/main
```

## Testing

### Run All Tests

```bash
# Backend
cd backend && npm run test && npm run test:e2e

# Frontend
cd frontend && npm run test && npm run test:e2e
```

### Write a Test

```typescript
// Example backend service test
describe('ProductService', () => {
  it('should find product by id', async () => {
    const product = await productService.findById('test-id');
    expect(product).toBeDefined();
  });
});
```

## Code Quality

### Format Code

```bash
# Backend
cd backend && npm run format

# Frontend
cd frontend && npm run format
```

### Lint Code

```bash
# Backend
cd backend && npm run lint

# Frontend
cd frontend && npm run lint
```

### Type Check

```bash
# Backend (built into build)
cd backend && npm run build

# Frontend
cd frontend && npm run type-check
```

## Useful Links

- **Next.js**: https://nextjs.org/docs
- **NestJS**: https://docs.nestjs.com
- **PostgreSQL**: https://www.postgresql.org/docs
- **Redis**: https://redis.io/docs
- **Crawlee**: https://crawlee.dev
- **SWR**: https://swr.vercel.app
- **Zustand**: https://github.com/pmndrs/zustand
- **Tailwind CSS**: https://tailwindcss.com/docs

## Documentation Files

| File | Purpose |
|------|---------|
| [README.md](./README.md) | Project overview |
| [GETTING_STARTED.md](./GETTING_STARTED.md) | Setup guide |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | API reference |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deployment guide |
| [CHECKLIST.md](./CHECKLIST.md) | Feature checklist |

## Need Help?

1. Check the relevant documentation file
2. Search GitHub issues
3. Check error logs in terminal
4. Verify environment variables
5. Try restart services
6. Open a GitHub issue with details

## Contributors

List of team members and their contributions:
- [Your name] - Frontend, UI/UX
- [Your name] - Backend, Database
- [Your name] - DevOps, Deployment
- [Your name] - Scraping, Integration

---

**Last Updated**: January 2024
**Version**: 1.0.0
**Status**: Production Ready ✅
