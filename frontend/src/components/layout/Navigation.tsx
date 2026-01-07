'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
          📚 Explorer
        </Link>
        <div className="flex gap-6">
          <Link
            href="/"
            className={`${
              pathname === '/' ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Home
          </Link>
          <Link
            href="/products"
            className={`${
              pathname === '/products'
                ? 'text-blue-600 font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Products
          </Link>
          <Link
            href="/about"
            className={`${
              pathname === '/about'
                ? 'text-blue-600 font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={`${
              pathname === '/contact'
                ? 'text-blue-600 font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
