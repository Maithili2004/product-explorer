import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import {
  Navigation,
  Category,
  Product,
  ProductDetail,
  Review,
  ScrapeJob,
  ViewHistory,
} from '../database/entities';

const entitiesPath = path.join(__dirname, '../database/entities/**/*.entity.ts');
const migrationsPath = path.join(__dirname, '../database/migrations/**/*.ts');

export const typeormConfig: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgresql://product_user:product_password@localhost:5432/product_explorer',
  entities: [
    Navigation,
    Category,
    Product,
    ProductDetail,
    Review,
    ScrapeJob,
    ViewHistory,
  ],
  migrations: [migrationsPath],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
};

export const AppDataSource = new DataSource(typeormConfig);
