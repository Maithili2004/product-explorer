'use client';

import { useCategory, useSubcategories, useProducts } from '@/hooks/use-api';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function CategoriesPage() {
  const params = useParams();
  const categoryId = params?.id as string;
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);

  const { category, isLoading: catLoading } = useCategory(categoryId);
  const { subcategories } = useSubcategories(categoryId);
  const { products } = useProducts(categoryId, limit, offset);

  if (catLoading) {
    return <div className="text-center py-12">Loading category...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Category Header */}
      {category && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-lg">
          <h1 className="text-4xl font-bold mb-2">{category.title}</h1>
          {category.description && <p className="text-lg opacity-90">{category.description}</p>}
          <p className="text-sm opacity-75 mt-2">
            {category.productCount} products available
          </p>
        </div>
      )}

      {/* Subcategories */}
      {subcategories && subcategories.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Subcategories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/categories/${sub.id}`}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
              >
                <h3 className="font-bold text-lg mb-1">{sub.title}</h3>
                <p className="text-sm text-gray-600">{sub.productCount} products</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products?.data?.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow border border-gray-200"
            >
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-48 object-cover bg-gray-200"
                />
              )}
              <div className="p-4">
                <h3 className="font-bold line-clamp-2">{product.title}</h3>
                {product.author && <p className="text-sm text-gray-600 mb-2">{product.author}</p>}
                {product.price && (
                  <p className="font-bold text-lg text-blue-600">
                    £{product.price.toFixed(2)}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {products && products.total > limit && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setOffset(Math.max(0, offset - limit))}
              disabled={offset === 0}
              className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {Math.floor(offset / limit) + 1} of {Math.ceil(products.total / limit)}
            </span>
            <button
              onClick={() => setOffset(offset + limit)}
              disabled={offset + limit >= products.total}
              className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
