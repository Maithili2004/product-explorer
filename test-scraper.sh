#!/bin/bash
# Quick test script for the scraper endpoint

API_URL="http://localhost:3001/api/v1"

echo "Testing scraper endpoint..."
curl -X POST "$API_URL/scraping/world-of-books" \
  -H "Content-Type: application/json" \
  -s | python3 -m json.tool

echo ""
echo "Fetching all products..."
curl -X GET "$API_URL/products" \
  -H "Content-Type: application/json" \
  -s | python3 -m json.tool | head -50
