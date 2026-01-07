'use client';

import { useProduct, useProductReviews, useRelatedProducts } from '@/hooks/use-api';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;

  const { product, isLoading } = useProduct(productId);
  const { reviews } = useProductReviews(productId);
  const { related } = useRelatedProducts(productId);

  if (isLoading) {
    return <div className="text-center py-12">Loading product details...</div>;
  }

  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }

  return (
    <div className="space-y-8">
      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full rounded-lg"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.title}</h1>

          {product.author && (
            <p className="text-xl text-gray-600 mb-4">by {product.author}</p>
          )}

          {product.price && (
            <div className="mb-6 flex items-baseline gap-2">
              <p className="text-4xl font-bold text-blue-600">£{product.price.toFixed(2)}</p>
              <p className="text-gray-600">{product.currency}</p>
            </div>
          )}

          {product.details?.ratingsAvg && (
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">⭐ {product.details.ratingsAvg.toFixed(1)}</span>
                <span className="text-gray-600">({product.details.reviewsCount} reviews)</span>
              </div>
            </div>
          )}

          <a
            href={product.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-8"
          >
            View on World of Books
          </a>

          {product.details?.fullDescription && (
            <div className="border-t pt-6">
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{product.details.fullDescription}</p>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      {reviews && reviews.data?.length > 0 && (
        <section className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="space-y-4">
            {reviews.data.map((review) => (
              <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="font-bold">{review.author || 'Anonymous'}</span>
                  <span className="text-yellow-500">⭐ {review.rating}/5</span>
                </div>
                <p className="text-gray-700">{review.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Products */}
      {related && related.length > 0 && (
        <section className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((relProduct) => (
              <Link
                key={relProduct.id}
                href={`/products/${relProduct.id}`}
                className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow border border-gray-200"
              >
                {relProduct.imageUrl && (
                  <img
                    src={relProduct.imageUrl}
                    alt={relProduct.title}
                    className="w-full h-48 object-cover bg-gray-200"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-bold line-clamp-2">{relProduct.title}</h3>
                  {relProduct.price && (
                    <p className="font-bold text-blue-600 mt-2">
                      £{relProduct.price.toFixed(2)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
