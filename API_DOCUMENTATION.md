# API Documentation

## Base URL

```
http://localhost:3001/api/v1
```

## Health Check

### Check Server Health

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-07T10:00:00Z",
  "uptime": 3600,
  "database": "connected"
}
```

## Navigation

### Get All Navigations

```http
GET /navigation
```

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Books",
    "slug": "books",
    "description": "Browse all books",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-07T10:00:00Z",
    "lastScrapedAt": "2024-01-07T10:00:00Z"
  }
]
```

### Get Navigation by ID

```http
GET /navigation/:id
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Books",
  "slug": "books",
  "description": "Browse all books",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-07T10:00:00Z",
  "lastScrapedAt": "2024-01-07T10:00:00Z"
}
```

### Trigger Navigation Scrape

```http
POST /scraping/navigation/scrape
```

**Response:**
```json
{
  "id": "uuid",
  "targetUrl": "https://www.worldofbooks.com",
  "targetType": "navigation",
  "status": "pending",
  "startedAt": "2024-01-07T10:00:00Z"
}
```

## Categories

### Get All Categories

```http
GET /categories?navigationId=uuid&limit=20&offset=0
```

**Query Parameters:**
- `navigationId` (optional): Filter by navigation ID
- `limit` (optional, default: 20): Number of results
- `offset` (optional, default: 0): Pagination offset

**Response:**
```json
[
  {
    "id": "uuid",
    "navigationId": "uuid",
    "parentId": null,
    "title": "Fiction",
    "slug": "fiction",
    "description": "Fiction books",
    "productCount": 150,
    "sourceUrl": "https://...",
    "sourceId": "fiction-123",
    "createdAt": "2024-01-01T00:00:00Z",
    "lastScrapedAt": "2024-01-07T10:00:00Z"
  }
]
```

### Get Category by ID

```http
GET /categories/:id
```

**Response:**
```json
{
  "id": "uuid",
  "navigationId": "uuid",
  "parentId": null,
  "title": "Fiction",
  "slug": "fiction",
  "description": "Fiction books",
  "productCount": 150,
  "sourceUrl": "https://...",
  "sourceId": "fiction-123",
  "createdAt": "2024-01-01T00:00:00Z",
  "lastScrapedAt": "2024-01-07T10:00:00Z",
  "children": [],
  "products": []
}
```

### Get Subcategories

```http
GET /categories/:id/subcategories
```

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Science Fiction",
    "slug": "science-fiction",
    "productCount": 45
  }
]
```

### Trigger Category Scrape

```http
POST /scraping/category/:id/scrape
```

**Response:**
```json
{
  "id": "uuid",
  "targetUrl": "https://www.worldofbooks.com/category/...",
  "targetType": "category",
  "status": "pending",
  "startedAt": "2024-01-07T10:00:00Z"
}
```

## Products

### Get All Products

```http
GET /products?categoryId=uuid&limit=20&offset=0
```

**Query Parameters:**
- `categoryId` (optional): Filter by category
- `limit` (optional, default: 20): Number of results
- `offset` (optional, default: 0): Pagination offset

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "categoryId": "uuid",
      "title": "Product Title",
      "author": "Author Name",
      "price": 19.99,
      "currency": "GBP",
      "imageUrl": "https://...",
      "sourceUrl": "https://...",
      "sourceId": "product-123",
      "description": "Product description",
      "createdAt": "2024-01-01T00:00:00Z",
      "lastScrapedAt": "2024-01-07T10:00:00Z",
      "details": {
        "id": "uuid",
        "fullDescription": "Full product description",
        "ratingsAvg": 4.5,
        "reviewsCount": 42,
        "isbn": "978-...",
        "publisher": "Publisher Name",
        "publicationDate": "2023-01-01",
        "pages": 350
      },
      "reviews": []
    }
  ],
  "total": 150,
  "limit": 20,
  "offset": 0
}
```

### Get Product by ID

```http
GET /products/:id
```

**Response:**
```json
{
  "id": "uuid",
  "categoryId": "uuid",
  "title": "Product Title",
  "author": "Author Name",
  "price": 19.99,
  "currency": "GBP",
  "imageUrl": "https://...",
  "sourceUrl": "https://...",
  "sourceId": "product-123",
  "description": "Product description",
  "createdAt": "2024-01-01T00:00:00Z",
  "details": {
    "id": "uuid",
    "fullDescription": "Full product description",
    "ratingsAvg": 4.5,
    "reviewsCount": 42,
    "isbn": "978-...",
    "publisher": "Publisher Name"
  },
  "reviews": [
    {
      "id": "uuid",
      "author": "John Doe",
      "rating": 5,
      "text": "Great product!",
      "createdAt": "2024-01-07T10:00:00Z"
    }
  ]
}
```

### Get Product Reviews

```http
GET /products/:id/reviews?limit=10&offset=0
```

**Query Parameters:**
- `limit` (optional, default: 10): Number of results
- `offset` (optional, default: 0): Pagination offset

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "productId": "uuid",
      "author": "John Doe",
      "rating": 5,
      "text": "Great product!",
      "helpfulCount": 12,
      "createdAt": "2024-01-07T10:00:00Z"
    }
  ],
  "total": 42,
  "limit": 10,
  "offset": 0
}
```

### Get Related Products

```http
GET /products/:id/related?limit=5
```

**Query Parameters:**
- `limit` (optional, default: 5): Number of results

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Related Product",
    "price": 15.99,
    "imageUrl": "https://...",
    "sourceUrl": "https://..."
  }
]
```

### Trigger Product Detail Scrape

```http
POST /scraping/product/:id/scrape
```

**Response:**
```json
{
  "id": "uuid",
  "targetUrl": "https://www.worldofbooks.com/product/...",
  "targetType": "product_detail",
  "status": "pending",
  "startedAt": "2024-01-07T10:00:00Z"
}
```

## Error Handling

All errors follow a consistent format:

```json
{
  "statusCode": 404,
  "timestamp": "2024-01-07T10:00:00Z",
  "path": "/api/v1/products/invalid-id",
  "message": "Product with ID invalid-id not found"
}
```

### Status Codes

- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limited
- `500 Internal Server Error` - Server error

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Limit**: 30 requests per minute per IP
- **Headers**:
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset time (Unix timestamp)

## Caching

Most GET endpoints cache results for 1 hour. To bypass cache, add `cache-control: no-cache` header.

## Examples

### JavaScript/Fetch

```javascript
// Get all navigations
const response = await fetch('http://localhost:3001/api/v1/navigation');
const navigations = await response.json();

// Get products with pagination
const params = new URLSearchParams({ limit: 20, offset: 0 });
const productsRes = await fetch(`http://localhost:3001/api/v1/products?${params}`);
const products = await productsRes.json();
```

### cURL

```bash
# Get all navigations
curl http://localhost:3001/api/v1/navigation

# Get specific product
curl http://localhost:3001/api/v1/products/product-id

# Trigger scrape
curl -X POST http://localhost:3001/api/v1/scraping/navigation/scrape
```

### Python

```python
import requests

# Get navigations
response = requests.get('http://localhost:3001/api/v1/navigation')
navigations = response.json()

# Get products
params = {'limit': 20, 'offset': 0}
response = requests.get('http://localhost:3001/api/v1/products', params=params)
products = response.json()
```
