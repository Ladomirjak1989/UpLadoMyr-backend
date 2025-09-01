// // src/app.module.ts
// import { Module } from '@nestjs/common';
// import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { join } from 'path';
// import { UserModule } from './user/user.module';
// import { AuthModule } from './auth/auth.module';
// import { TerminusModule } from '@nestjs/terminus';
// import { HealthController } from './health/health.controller';

// @Module({
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true }),

//     TypeOrmModule.forRootAsync({
//       inject: [ConfigService],
//       useFactory: (cfg: ConfigService): TypeOrmModuleOptions => {
//         const isProd = cfg.get('NODE_ENV') === 'production';
//         const databaseUrl = cfg.get<string>('DATABASE_URL') ?? '';
//         const isExternal = databaseUrl !== '' && !databaseUrl.includes('.internal');


//         // ✅ звичайні мутабельні масиви з правильним типом
//         const baseLogging: (
//           'query' | 'error' | 'warn' | 'info' | 'log' | 'migration' | 'schema'
//         )[] = ['error', 'warn'];

//         const verboseLogging: (
//           'query' | 'error' | 'warn' | 'info' | 'log' | 'migration' | 'schema'
//         )[] = ['error', 'warn', 'schema', 'migration'];

//         const debugDb = (cfg.get('DEBUG_DB') ?? '') === '1';

//         const common: Partial<TypeOrmModuleOptions> = {
//           autoLoadEntities: true,
//           synchronize: false,
//           migrationsRun: true,
//           logger: 'advanced-console',
//           logging: debugDb ? verboseLogging : baseLogging,
//         };

//         if (isProd && databaseUrl) {
//           // PROD @ Render: міграції замість synchronize
//           return {
//             type: 'postgres',
//             url: databaseUrl,
//             synchronize: false,
//             migrations: [join(__dirname, 'migrations/*.{js}')],
//             ssl: isExternal ? { rejectUnauthorized: false } : false,
//             ...common,

//           };
//         }

//         // DEV (localhost або зовнішня БД із SSL)
//         const host = cfg.get<string>('DB_HOST') ?? 'localhost';
//         const port = parseInt(cfg.get('DB_PORT') ?? '5433', 10);
//         const needSsl =
//           (cfg.get('DB_SSL') ?? '').toString().toLowerCase() === 'true' ||
//           host.includes('render.com') ||
//           host.includes('neon.tech') ||
//           host.includes('amazonaws.com');

//         return {
//           type: 'postgres',
//           host,
//           port,
//           username: cfg.get('DB_USERNAME') ?? 'postgres',
//           password: cfg.get('DB_PASSWORD') ?? '',
//           database: cfg.get('DB_NAME') ?? 'app',



//           migrations: [join(__dirname, 'migrations/*.{ts,js}')],
//           ssl: needSsl ? { rejectUnauthorized: false } : false,
//           ...common,

//         };
//       },
//     }),

//     TerminusModule,
//     UserModule,
//     AuthModule,
//   ],
//   controllers: [HealthController],
// })
// export class AppModule { }



// src/app.module.ts
import { Module } from '@nestjs/common';
import {
  TypeOrmModule,
  type TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService): TypeOrmModuleOptions => {
        const isProd = cfg.get<string>('NODE_ENV') === 'production';
        const databaseUrl = cfg.get<string>('DATABASE_URL') ?? '';
        const isExternal =
          databaseUrl !== '' && !databaseUrl.includes('.internal');
        const debugDb = (cfg.get<string>('DEBUG_DB') ?? '') === '1';

        // ===== PROD @ Render, через DATABASE_URL =====
        if (isProd && databaseUrl) {
          const opts: TypeOrmModuleOptions = {
            type: 'postgres',
            url: databaseUrl,
            autoLoadEntities: true,
            synchronize: false,
            migrationsRun: true,
            migrations: [join(__dirname, 'migrations/*.{js}')],
            ssl: isExternal ? { rejectUnauthorized: false } : false,
            logging: debugDb ? 'all' : ['error', 'warn'],
          };

          if (debugDb) {
            // Не світимо креденшли в логах:
            console.log('[DB] PROD connection:', {
              url: databaseUrl.replace(/:\/\/.*@/, '://***:***@'),
              ssl: opts.ssl,
              migrations: opts.migrations,
            });
          }

          return opts;
        }

        // ===== DEV (локально або зовнішня БД із SSL) =====
        const host = cfg.get<string>('DB_HOST') ?? 'localhost';
        const port = parseInt(cfg.get<string>('DB_PORT') ?? '5433', 10);
        const username = cfg.get<string>('DB_USERNAME') ?? 'postgres';
        const password = cfg.get<string>('DB_PASSWORD') ?? '';
        const database = cfg.get<string>('DB_NAME') ?? 'app';

        const needSsl =
          (cfg.get<string>('DB_SSL') ?? '')
            .toString()
            .toLowerCase() === 'true' ||
          host.includes('render.com') ||
          host.includes('neon.tech') ||
          host.includes('amazonaws.com');

        const opts: TypeOrmModuleOptions = {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          autoLoadEntities: true,
          synchronize: false, // міграції замість sync
          migrationsRun: true,
          migrations: [join(__dirname, 'migrations/*.{ts,js}')],
          ssl: needSsl ? { rejectUnauthorized: false } : false,
          logging: debugDb ? 'all' : ['error', 'warn'],
        };

        if (debugDb) {
          console.log('[DB] DEV connection:', {
            host,
            port,
            username,
            database,
            ssl: opts.ssl,
            migrations: opts.migrations,
          });
        }

        return opts;
      },
    }),

    TerminusModule,
    UserModule,
    AuthModule,
  ],
  controllers: [HealthController],
})
export class AppModule { }

