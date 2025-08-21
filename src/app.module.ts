// 1. app.module.ts signup, signin для locslhost 5000!!!

// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule } from '@nestjs/config';

// import { User } from './user/user.entity';
// import { UserModule } from './user/user.module';
// import { AuthModule } from './auth/auth.module'; 

// @Module({
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true }),

//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: process.env.DB_HOST,
//       port: parseInt(process.env.DB_PORT || '5433', 10),
//       username: process.env.DB_USERNAME,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_NAME,
//       entities: [User],

//       synchronize: true,
//     }),

//     UserModule,
//     AuthModule, 
//   ],
// })
// export class AppModule { }




//2. app.module.ts signup, signin для продакшена!!!

// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule } from '@nestjs/config';
// import { UserModule } from './user/user.module';
// import { AuthModule } from './auth/auth.module';
// import { TerminusModule } from '@nestjs/terminus';
// import { HealthController } from './health/health.controller';

// const isExternal = (process.env.DATABASE_URL ?? '').includes('.internal') === false;

// @Module({
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true }),
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       url: process.env.DATABASE_URL,
//       autoLoadEntities: true,
//       synchronize: false, // <- фіксуємо вимкнено
//       ssl: isExternal ? { rejectUnauthorized: false } : false,
//     }),
//     TerminusModule,
//     UserModule,
//     AuthModule,
//   ],
//   controllers: [HealthController],
// })
// export class AppModule { }



import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';

const isProd = process.env.NODE_ENV === 'production';

// Якщо є DATABASE_URL — беремо її; інакше збираємо URL із DB_* (локалка)
const localUrl =
  `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}` +
  `@${process.env.DB_HOST}:${process.env.DB_PORT ?? 5433}/${process.env.DB_NAME}`;

const url = process.env.DATABASE_URL ?? localUrl;

// Просте визначення, чи потрібен SSL (Render/sslmode=require)
const needsSSL = /onrender\.com|render\.com|sslmode=require/i.test(url);

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url,
      autoLoadEntities: true,
      synchronize: false,                   // ← завжди ВИМКНЕНО (і dev, і prod)
      ssl: needsSSL ? { rejectUnauthorized: false } : false,
      // optional:
      // keepConnectionAlive: true,
      // logging: isProd ? ['error'] : ['warn', 'error'],
    }),

    TerminusModule,
    UserModule,
    AuthModule,
  ],
  controllers: [HealthController],
})
export class AppModule { }
