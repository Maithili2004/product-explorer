import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { HealthModule } from './modules/health/health.module';
import { NavigationModule } from './modules/navigation/navigation.module';
import { CategoryModule } from './modules/categories/category.module';
import { ProductModule } from './modules/products/product.module';
import { ScrapingModule } from './modules/scraping/scraping.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  singleLine: false,
                  translateTime: 'SYS:standard',
                  ignore: 'pid,hostname',
                },
              }
            : undefined,
        level: process.env.LOG_LEVEL || 'info',
      },
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const path = require('path');
        const entitiesPath = path.join(__dirname, 'database', 'entities', '*.entity.js');
        
        // Always use SQLite - works on Render free tier without external DB
        const dbPath = process.env.NODE_ENV === 'production' 
          ? '/opt/render/project/src/backend/data/product_explorer.db'
          : 'C:/Users/User/Desktop/internshala_project/backend/data/product_explorer.db';
        
        console.log('Using SQLite database at:', dbPath);
        return {
          type: 'sqlite' as const,
          database: dbPath,
          entities: [entitiesPath],
          synchronize: true,
          logging: false,
        };
      },
    }),
    // BullModule commented out for local testing - Redis not configured
    // BullModule.forRoot({
    //   redis: process.env.REDIS_URL || 'redis://localhost:6379',
    // }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '30'),
      },
    ]),
    HealthModule,
    NavigationModule,
    CategoryModule,
    ProductModule,
    ScrapingModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
