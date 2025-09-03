import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cookieParser = require('cookie-parser');
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // 👇 Типізуємо як Express-варіант
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Дістаємо нативний інстанс Express
  const express = app.getHttpAdapter().getInstance();

  // Кеш/проксі
  express.disable('etag');         // еквівалент app.set('etag', false)
  express.set('trust proxy', 1);   // потрібне для Secure cookies за CDN/Render


  // Префікс /api
  app.setGlobalPrefix('api');                // -> /api/auth/...
  

  // Безпека
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

  // Валідація DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Куки
  app.use(cookieParser(process.env.COOKIE_SECRET || undefined));

  // CORS
  const allowedOrigins = [
    process.env.FRONTEND_URL_LOCALHOST_URL || 'http://localhost:3000',
    process.env.FRONTEND_URL_PROD || 'https://upladomyr.com',
  ].filter(Boolean) as string[];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    
  });

  const port = Number(process.env.PORT) || 5000;
  console.log(`🚀 Server is running on port ${port}`);

  await app.listen(port, '0.0.0.0');
}
bootstrap();
