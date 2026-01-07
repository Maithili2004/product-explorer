import { AppDataSource } from '../../config/database.config';
import { Navigation, Category, Product, ProductDetail, Review } from '../entities';

async function seed() {
  // Connect to database
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const navigationRepo = AppDataSource.getRepository(Navigation);
  const categoryRepo = AppDataSource.getRepository(Category);
  const productRepo = AppDataSource.getRepository(Product);
  const detailRepo = AppDataSource.getRepository(ProductDetail);
  const reviewRepo = AppDataSource.getRepository(Review);

  console.log('🌱 Starting database seed...');

  try {
    // Create Navigations
    const navigations = await navigationRepo.save([
      {
        title: 'Books',
        slug: 'books',
        description: 'Browse our collection of books',
        lastScrapedAt: new Date(),
      },
      {
        title: 'Categories',
        slug: 'categories',
        description: 'Shop by category',
        lastScrapedAt: new Date(),
      },
      {
        title: "Children's Books",
        slug: 'childrens-books',
        description: 'Books for children',
        lastScrapedAt: new Date(),
      },
    ]);

    console.log('✅ Created 3 navigations');

    // Create Categories
    const categories = await categoryRepo.save([
      {
        navigationId: navigations[0].id,
        title: 'Fiction',
        slug: 'fiction',
        description: 'Fictional stories and novels',
        productCount: 150,
        sourceUrl: 'https://www.worldofbooks.com/fiction',
        sourceId: 'fiction-001',
        lastScrapedAt: new Date(),
      },
      {
        navigationId: navigations[0].id,
        title: 'Non-Fiction',
        slug: 'non-fiction',
        description: 'True stories and factual books',
        productCount: 200,
        sourceUrl: 'https://www.worldofbooks.com/non-fiction',
        sourceId: 'nonfiction-001',
        lastScrapedAt: new Date(),
      },
      {
        navigationId: navigations[0].id,
        parentId: navigations[0].id,
        title: 'Science Fiction',
        slug: 'science-fiction',
        description: 'Futuristic and sci-fi stories',
        productCount: 75,
        sourceUrl: 'https://www.worldofbooks.com/science-fiction',
        sourceId: 'scifi-001',
        lastScrapedAt: new Date(),
      },
    ]);

    console.log('✅ Created 3 categories');

    // Create Products
    const products = await productRepo.save([
      {
        categoryId: categories[0].id,
        title: 'The Midnight Library',
        author: 'Matt Haig',
        price: 14.99,
        currency: 'GBP',
        imageUrl: 'https://via.placeholder.com/200x300?text=Midnight+Library',
        sourceUrl: 'https://www.worldofbooks.com/books/the-midnight-library',
        sourceId: 'book-001',
        description: 'A dazzling novel about all the choices that go into a life well lived',
        contentHash: 'abc123def456',
        lastScrapedAt: new Date(),
      },
      {
        categoryId: categories[0].id,
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        price: 18.99,
        currency: 'GBP',
        imageUrl: 'https://via.placeholder.com/200x300?text=Sapiens',
        sourceUrl: 'https://www.worldofbooks.com/books/sapiens',
        sourceId: 'book-002',
        description: 'A brief history of humankind',
        contentHash: 'ghi789jkl012',
        lastScrapedAt: new Date(),
      },
      {
        categoryId: categories[2].id,
        title: 'Dune',
        author: 'Frank Herbert',
        price: 12.99,
        currency: 'GBP',
        imageUrl: 'https://via.placeholder.com/200x300?text=Dune',
        sourceUrl: 'https://www.worldofbooks.com/books/dune',
        sourceId: 'book-003',
        description: 'An epic science fiction novel',
        contentHash: 'mno345pqr678',
        lastScrapedAt: new Date(),
      },
    ]);

    console.log('✅ Created 3 products');

    // Create Product Details
    await detailRepo.save([
      {
        productId: products[0].id,
        fullDescription:
          'The Midnight Library is a dazzling novel about all the choices that go into a life well lived. Between life and death there is a library, and within that library the shelves go on forever. Every book provides a chance to try another life you could have lived.',
        ratingsAvg: 4.5,
        reviewsCount: 3,
        isbn: '978-0020031604',
        publisher: 'Viking',
        publicationDate: new Date('2020-08-13'),
        pages: 400,
      },
      {
        productId: products[1].id,
        fullDescription:
          'From a renowned historian comes a sweeping history of humankind, exploring how the cognitive revolution enabled our species to dominate the world.',
        ratingsAvg: 4.7,
        reviewsCount: 2,
        isbn: '978-0062316097',
        publisher: 'HarperCollins',
        publicationDate: new Date('2014-09-30'),
        pages: 465,
      },
      {
        productId: products[2].id,
        fullDescription:
          'Set on the desert planet Arrakis, this epic science fiction novel explores themes of power, religion, politics, and ecology.',
        ratingsAvg: 4.6,
        reviewsCount: 1,
        isbn: '978-0441172719',
        publisher: 'Ace',
        publicationDate: new Date('1965-06-01'),
        pages: 688,
      },
    ]);

    console.log('✅ Created 3 product details');

    // Create Reviews
    await reviewRepo.save([
      {
        productId: products[0].id,
        author: 'Jane Doe',
        rating: 5,
        text: 'Absolutely loved this book! A beautiful exploration of life choices.',
        helpfulCount: 15,
      },
      {
        productId: products[0].id,
        author: 'John Smith',
        rating: 4,
        text: 'Great premise and characters. Highly recommended.',
        helpfulCount: 8,
      },
      {
        productId: products[0].id,
        author: 'Alex Johnson',
        rating: 4,
        text: 'Thought-provoking and heartwarming.',
        helpfulCount: 12,
      },
      {
        productId: products[1].id,
        author: 'Sam Wilson',
        rating: 5,
        text: 'A must-read for anyone interested in history.',
        helpfulCount: 20,
      },
      {
        productId: products[1].id,
        author: 'Pat Brown',
        rating: 4,
        text: 'Eye-opening but dense at times.',
        helpfulCount: 7,
      },
      {
        productId: products[2].id,
        author: 'Taylor Lee',
        rating: 5,
        text: 'One of the greatest sci-fi novels ever written.',
        helpfulCount: 25,
      },
    ]);

    console.log('✅ Created 6 reviews');

    console.log('\n✨ Database seed completed successfully!');
    console.log('📊 Summary:');
    console.log('  - Navigations: 3');
    console.log('  - Categories: 3');
    console.log('  - Products: 3');
    console.log('  - Reviews: 6');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
