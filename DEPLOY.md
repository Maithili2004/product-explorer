# Deployment Guide

## Backend Deployment (Render)

1. **Create a Render account:** https://render.com

2. **Connect your GitHub repo:**
   - Fork/push this repo to GitHub
   - Go to Render and create a new Web Service
   - Connect your GitHub repository
   
3. **Configure environment variables in Render dashboard:**
   ```
   DATABASE_URL=your-neon-postgresql-connection-string
   NODE_ENV=production
   ```

4. **Build command:**
   ```bash
   cd backend && npm install && npm run build
   ```

5. **Start command:**
   ```bash
   cd backend && npm run start
   ```

6. **Note your deployed URL** (e.g., `https://your-app.onrender.com`)

## Frontend Deployment (Vercel)

1. **Create a Vercel account:** https://vercel.com

2. **Import your GitHub project:**
   - Click "Import Project"
   - Select your GitHub repo
   - Choose the `frontend` directory as the root

3. **Configure environment variables:**
   ```
   NEXT_PUBLIC_API_URL=https://your-app.onrender.com/api/v1
   ```

4. **Deploy:** Vercel will automatically build and deploy

## Local Testing

```bash
# Terminal 1: Backend
cd backend
npm install
npm run start  # Runs on http://localhost:3001

# Terminal 2: Frontend
cd frontend
npm install
npm run dev    # Runs on http://localhost:3000
```

## Database Setup

1. Create a free PostgreSQL database at Neon: https://neon.tech
2. Copy the connection string
3. Add it to `.env` in the backend directory
4. The schema is automatically created on first run

## Scraper

The `/api/v1/scraping/world-of-books` endpoint returns 8 mock books from the World of Books catalog. Data is automatically deduplicated by `sourceUrl`.

## API Documentation

See `API_DOCUMENTATION.md` for full endpoint reference.
