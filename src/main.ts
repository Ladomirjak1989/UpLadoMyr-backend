// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import * as cookieParser from 'cookie-parser';




// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);


//   // ✅ Додаємо глобальний prefix для API (опційно, якщо хочеш мати типу /api/users)
//   app.setGlobalPrefix('api');

//   // ✅ Включаємо глобальну валідацію DTO
//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,         // видаляє зайві поля, які не описані в DTO
//       forbidNonWhitelisted: true, // викине помилку, якщо будуть "ліві" поля
//       transform: true,         // автоматично трансформує типи (наприклад string у number)
//     }),
//   );

//   // ✅ Додаємо CORS для локальної розробки та продакшену
//   const allowedOrigins = [
//     'http://localhost:3000',
//     'https://upladomyr.com',
//   ];


//   app.use(cookieParser())

//   app.enableCors({
//     origin: allowedOrigins,
//     credentials: true,
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//     allowedHeaders: 'Content-Type, Authorization',
//   });

//   // ✅ Додаємо лог порту
//   const port = process.env.PORT ?? 5000;
//   console.log(`🚀 Server is running on port ${port}`);

//   await app.listen(port);
// }
// bootstrap();




import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Префікс /api
  app.setGlobalPrefix('api');

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
  app.use(cookieParser());

  // CORS
  const allowedOrigins = [
    process.env.FRONTEND_URL_LOCAL || 'http://localhost:3000',
    process.env.FRONTEND_URL_PROD || 'https://upladomyr.com',
  ].filter(Boolean) as string[];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = Number(process.env.PORT) || 5000;
  console.log(`🚀 Server is running on port ${port}`);

  await app.listen(port, '0.0.0.0');
}
bootstrap();
