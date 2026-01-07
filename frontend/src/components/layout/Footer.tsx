'use client';

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">📚 Product Explorer</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your one-stop shop for discovering and exploring thousands of products with advanced filtering and personalized recommendations.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Navigation</h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>
                <a href="/API_DOCUMENTATION.md" className="hover:text-white transition-colors">
                  API Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Connect</h3>
            <p className="text-gray-400 text-sm mb-4">
              Follow us on social media for updates and announcements.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-400 transition-colors" aria-label="Twitter">
                𝕏
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors" aria-label="Facebook">
                f
              </a>
              <a href="#" className="hover:text-pink-600 transition-colors" aria-label="Instagram">
                📷
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} Product Data Explorer. All rights reserved. | Made with 💙 for better product discovery</p>
        </div>
      </div>
    </footer>
  );
}
