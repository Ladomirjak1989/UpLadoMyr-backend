import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
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
      whitelist: true,    // прибирає з body усі поля, що не описані в DTO
      forbidNonWhitelisted: true,    // якщо прийшли зайві поля — 400 Bad Request
      transform: true,    // перетворює plain-об’єкти у екземпляри DTO
      transformOptions: { enableImplicitConversion: true }, // зручно для query/params
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








// {
//   "name": "backend",
//   "version": "0.0.1",
//   "description": "",
//   "author": "",
//   "private": true,
//   "license": "UNLICENSED",
//   "scripts": {
//     "prebuild": "rimraf dist",
//     "clean": "rimraf --glob dist \"tsconfig*.tsbuildinfo\"",
//     "build": "nest build",
//     "seed:admin": "node dist/cli/seed-admin.js",
//     "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
//     "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
//     "start": "nest start",
//     "start:dev": "nest start --watch",
//     "start:debug": "nest start --debug --watch",
//     "start:prod": "node dist/main.js",
//     "start:render": "npm run mig:run:file && npm run seed:admin && node dist/main.js",
//     "test": "jest",
//     "test:watch": "jest --watch",
//     "test:cov": "jest --coverage",
//     "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
//     "test:e2e": "jest --config ./test/jest-e2e.json",
//     "mig:run:file": "node scripts/run-migrations.js",
//     "mig:revert:file": "node scripts/revert-migration.js",
//     "mig:gen": "typeorm-ts-node-esm -d src/data-source.ts migration:generate src/migrations/auto",
//     "mig:create": "typeorm-ts-node-esm -d src/data-source.ts migration:create src/migrations/custom",
//     "mig:run": "typeorm-ts-node-esm -d src/data-source.ts migration:run",
//     "mig:revert": "typeorm-ts-node-esm -d src/data-source.ts migration:revert"
//   },
//   "dependencies": {
//     "@nestjs/common": "^11.0.1",
//     "@nestjs/config": "^4.0.2",
//     "@nestjs/core": "^11.0.1",
//     "@nestjs/jwt": "^11.0.0",
//     "@nestjs/mapped-types": "^2.1.0",
//     "@nestjs/passport": "^11.0.5",
//     "@nestjs/platform-express": "^11.0.1",
//     "@nestjs/terminus": "^11.0.0",
//     "@nestjs/typeorm": "^11.0.0",
//     "bcrypt": "^6.0.0",
//     "class-transformer": "^0.5.1",
//     "class-validator": "^0.14.2",
//     "cookie-parser": "^1.4.7",
//     "dotenv": "^17.2.1",
//     "helmet": "^8.1.0",
//     "passport": "^0.7.0",
//     "passport-facebook": "^3.0.0",
//     "passport-google-oauth20": "^2.0.0",
//     "passport-jwt": "^4.0.1",
//     "pg": "^8.16.3",
//     "reflect-metadata": "^0.2.2",
//     "rxjs": "^7.8.1",
//     "typeorm": "^0.3.25"
//   },
//   "devDependencies": {
//     "@eslint/eslintrc": "^3.2.0",
//     "@eslint/js": "^9.18.0",
//     "@nestjs/cli": "^11.0.10",
//     "@nestjs/schematics": "^11.0.0",
//     "@nestjs/testing": "^11.0.1",
//     "@swc/cli": "^0.6.0",
//     "@swc/core": "^1.10.7",
//     "@types/bcrypt": "^6.0.0",
//     "@types/cookie-parser": "^1.4.9",
//     "@types/express": "^5.0.0",
//     "@types/helmet": "^0.0.48",
//     "@types/jest": "^29.5.14",
//     "@types/node": "^22.10.7",
//     "@types/passport": "^1.0.17",
//     "@types/passport-facebook": "^3.0.3",
//     "@types/passport-google-oauth20": "^2.0.16",
//     "@types/passport-jwt": "^4.0.1",
//     "@types/supertest": "^6.0.2",
//     "cross-env": "^10.0.0",
//     "eslint": "^9.18.0",
//     "eslint-config-prettier": "^10.0.1",
//     "eslint-plugin-prettier": "^5.2.2",
//     "globals": "^16.0.0",
//     "jest": "^29.7.0",
//     "prettier": "^3.4.2",
//     "rimraf": "^6.0.1",
//     "source-map-support": "^0.5.21",
//     "supertest": "^7.0.0",
//     "ts-jest": "^29.2.5",
//     "ts-loader": "^9.5.2",
//     "ts-node": "^10.9.2",
//     "tsconfig-paths": "^4.2.0",
//     "typeorm-ts-node-esm": "^0.3.20",
//     "typescript": "^5.8.3",
//     "typescript-eslint": "^8.20.0"
//   },
//   "jest": {
//     "moduleFileExtensions": [
//       "js",
//       "json",
//       "ts"
//     ],
//     "rootDir": "src",
//     "testRegex": ".*\\.spec\\.ts$",
//     "transform": {
//       "^.+\\.(t|j)s$": "ts-jest"
//     },
//     "collectCoverageFrom": [
//       "**/*.(t|j)s"
//     ],
//     "coverageDirectory": "../coverage",
//     "testEnvironment": "node"
//   }
// }
