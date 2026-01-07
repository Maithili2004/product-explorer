'use client';

import { useNavigations } from '@/hooks/use-api';
import { useHistoryStore } from '@/store/history';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const { navigations, isLoading, error } = useNavigations();
  const addEntry = useHistoryStore((state) => state.addEntry);
  const [scraping, setScraping] = useState(false);

  const handleNavigationClick = (id: string, title: string) => {
    addEntry({
      path: `/categories/${id}`,
      title,
      type: 'navigation',
      id,
    });
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Failed to Load</h1>
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
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg">
        <h1 className="text-5xl font-bold mb-4">Product Data Explorer</h1>
        <p className="text-xl mb-8">
          Discover and explore products from World of Books
        </p>
        <p className="text-lg opacity-90">Browse thousands of products with advanced search and filtering</p>
      </section>

      {/* Navigation Headings */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Browse Categories</h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="skeleton h-32 rounded-lg"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {navigations?.map((nav) => (
              <Link
                key={nav.id}
                href={`/categories/${nav.id}`}
                onClick={() => handleNavigationClick(nav.id, nav.title)}
                className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-blue-400 cursor-pointer group transition-all"
              >
                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 mb-2">
                  {nav.title}
                </h3>
                {nav.description && (
                  <p className="text-gray-600 text-sm">{nav.description}</p>
                )}
                <div className="mt-4 text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                  Explore →
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-bold mb-2">🔍 Smart Search</h3>
            <p className="text-gray-600 text-sm">Find products quickly with advanced filtering options</p>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-bold mb-2">⭐ Ratings & Reviews</h3>
            <p className="text-gray-600 text-sm">Read real user reviews and ratings for informed decisions</p>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-bold mb-2">📊 Live Data</h3>
            <p className="text-gray-600 text-sm">Always up-to-date product information and pricing</p>
          </div>
        </div>
      </section>
    </div>
  );
}
