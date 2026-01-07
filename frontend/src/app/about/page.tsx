'use client';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold">About Product Data Explorer</h1>

      <section>
        <h2 className="text-2xl font-bold mb-4">Mission</h2>
        <p className="text-gray-700 leading-relaxed">
          Product Data Explorer is a modern web application designed to help users discover and
          explore products from World of Books. Our mission is to provide a seamless, fast, and
          intuitive platform for browsing, searching, and learning about products.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Technology</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold mb-2">Frontend</h3>
            <ul className="text-gray-700 space-y-1 text-sm">
              <li>• Next.js 14 with App Router</li>
              <li>• React 18 with TypeScript</li>
              <li>• Tailwind CSS for styling</li>
              <li>• SWR for data fetching</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Backend</h3>
            <ul className="text-gray-700 space-y-1 text-sm">
              <li>• NestJS with Node.js</li>
              <li>• PostgreSQL database</li>
              <li>• Redis caching</li>
              <li>• Crawlee + Playwright for scraping</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Features</h2>
        <ul className="space-y-2 text-gray-700">
          <li>✅ Advanced product search and filtering</li>
          <li>✅ Real-time product data with live scraping</li>
          <li>✅ Comprehensive product reviews and ratings</li>
          <li>✅ Smart product recommendations</li>
          <li>✅ Responsive design for all devices</li>
          <li>✅ Fast page loads with caching</li>
          <li>✅ Accessible interface (WCAG AA compliant)</li>
          <li>✅ Ethical web scraping with rate limiting</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Ethical Scraping</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We respect the terms of service and robots.txt of World of Books. Our scraping
          implementation includes:
        </p>
        <ul className="space-y-2 text-gray-700">
          <li>• Appropriate delays between requests (2-5 seconds)</li>
          <li>• Exponential backoff for rate limiting</li>
          <li>• Smart caching to minimize repeated requests</li>
          <li>• Daily quotas to prevent overload</li>
          <li>• Respectful user-agent headers</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Contact & Support</h2>
        <p className="text-gray-700">
          For questions, bug reports, or feature requests, please open an issue on our GitHub
          repository or contact us directly.
        </p>
      </section>
    </div>
  );
}
