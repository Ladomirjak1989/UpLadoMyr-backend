// 1. app.module.ts signup, signin для locslhost 5000!!!

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module'; 

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5433', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User],

      synchronize: true,
    }),

    UserModule,
    AuthModule, 
  ],
})
export class AppModule { }




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











// src/app.module.ts
// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule } from '@nestjs/config';

// import { UserModule } from './user/user.module';
// import { AuthModule } from './auth/auth.module';
// import { TerminusModule } from '@nestjs/terminus';
// import { HealthController } from './health/health.controller';

// function buildFromPieces(env: NodeJS.ProcessEnv) {
//   return {
//     host: env.DB_HOST || 'localhost',
//     port: Number(env.DB_PORT || 5433),
//     username: env.DB_USERNAME || 'postgres',
//     password: String(env.DB_PASSWORD ?? ''), // гарантуємо рядок
//     database: env.DB_NAME || 'postgres',
//     ssl: false as any,
//   };
// }

// function buildFromUrl(raw: string) {
//   const u = new URL(raw);
//   const ssl = u.searchParams.get('sslmode') === 'require'
//     ? { rejectUnauthorized: false }
//     : false;

//   return {
//     host: u.hostname,
//     port: Number(u.port || 5432),
//     username: decodeURIComponent(u.username),
//     password: decodeURIComponent(u.password || ''), // гарантуємо рядок
//     database: u.pathname.replace(/^\//, ''),
//     ssl,
//   };
// }

// @Module({
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),

//     TypeOrmModule.forRootAsync({
//       imports: [ConfigModule],
//       useFactory: () => {
//         // після ConfigModule – .env уже в process.env
//         const rawUrl =
//           process.env.DATABASE_URL ||
//           process.env.DATABASE_POSTGRES_URL ||
//           '';

//         const cfg = rawUrl
//           ? buildFromUrl(rawUrl)
//           : buildFromPieces(process.env);

//         // простий sanity-лог без пароля
//         console.log(
//           '[DB] host:', cfg.host,
//           'port:', cfg.port,
//           'db:', cfg.database,
//           'ssl:', !!cfg.ssl,
//           'source:', rawUrl ? 'DATABASE_URL' : 'DB_*'
//         );

//         // викинемо зрозумілу помилку, якщо пароля немає (а потрібен)
//         if (typeof cfg.password !== 'string') {
//           throw new Error('DB password must be a string');
//         }

//         return {
//           type: 'postgres',
//           host: cfg.host,
//           port: cfg.port,
//           username: cfg.username,
//           password: cfg.password,   // <- точно рядок
//           database: cfg.database,
//           ssl: cfg.ssl,
//           autoLoadEntities: true,
//           synchronize: false,
//         };
//       },
//     }),

//     TerminusModule,
//     UserModule,
//     AuthModule,
//   ],
//   controllers: [HealthController],
// })
// export class AppModule {}

