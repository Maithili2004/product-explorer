'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAllProducts } from '@/hooks/use-api';
import { useHistoryStore } from '@/store/history';

export default function ProductsPage() {
  const [limit, setLimit] = useState(12);
  const [offset, setOffset] = useState(0);
  const { products, isLoading, error } = useAllProducts(limit, offset);
  const addEntry = useHistoryStore((state) => state.addEntry);

  const handleProductClick = (id: string, title: string) => {
    addEntry({
      path: `/products/${id}`,
      title,
      type: 'product',
      id,
    });
  };

  const handlePageChange = (newOffset: number) => {
    setOffset(Math.max(0, newOffset));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Failed to Load Products</h1>
        <p className="text-gray-600 mb-6">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-lg">
        <h1 className="text-4xl font-bold mb-4">All Products</h1>
        <p className="text-lg opacity-90">Browse our complete catalog of products</p>
      </div>

      {/* Filter/Sort */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 items-center">
          <label htmlFor="limit" className="font-semibold text-gray-700">
            Items per page:
          </label>
          <select
            id="limit"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setOffset(0);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={48}>48</option>
          </select>
        </div>
        <p className="text-gray-600">
          Showing {offset + 1} to {Math.min(offset + limit, (products?.length || 0) + offset)}
        </p>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              onClick={() => handleProductClick(product.id, product.title)}
              className="group"
            >
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-blue-400 transition-all h-full flex flex-col">
                {/* Image */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400 text-sm">No image</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-sm md:text-base line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                    {product.title}
                  </h3>

                  {product.description && (
                    <p className="text-xs text-gray-600 line-clamp-2 mb-4 flex-grow">
                      {product.description}
                    </p>
                  )}

                  {product.price && (
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-blue-600">
                        £{product.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-500">{product.currency}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No products found</p>
        </div>
      )}

      {/* Pagination */}
      {products && products.length > 0 && (
        <div className="flex justify-center items-center gap-4 py-8">
          <button
            onClick={() => handlePageChange(offset - limit)}
            disabled={offset === 0}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            ← Previous
          </button>

          <div className="flex items-center gap-2">
            <span className="text-gray-600">
              Page {Math.floor(offset / limit) + 1}
            </span>
          </div>

          <button
            onClick={() => handlePageChange(offset + limit)}
            disabled={!products || products.length < limit}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
