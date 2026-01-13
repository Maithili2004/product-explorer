import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

// Keep process alive
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use Pino logger
  app.useLogger(app.get(Logger));

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // API versioning
  app.setGlobalPrefix(`${process.env.API_PREFIX || 'api'}/${process.env.API_VERSION || 'v1'}`);

  const port = process.env.PORT || 3001;
  const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
  const server = await app.listen(port, host);
  console.log(`🚀 Server is running on http://${host}:${port}`);
  
  // Keep the process alive
  setInterval(() => {}, 1000 * 60 * 60); // Keep alive for hours
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
