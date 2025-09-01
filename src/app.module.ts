// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
      useFactory: (cfg: ConfigService) => {
        const isProd = cfg.get('NODE_ENV') === 'production';
        const databaseUrl = cfg.get<string>('DATABASE_URL') ?? '';
        const isExternal = databaseUrl !== '' && !databaseUrl.includes('.internal');

        if (isProd && databaseUrl) {
          // PROD @ Render: міграції замість synchronize
          return {
            type: 'postgres',
            url: databaseUrl,
            autoLoadEntities: true,
            synchronize: false,
            migrationsRun: true,
            migrations: [join(__dirname, 'migrations/*.{js}')],
            ssl: isExternal ? { rejectUnauthorized: false } : false,
          };
        }

        // DEV (localhost або зовнішня БД із SSL)
        const host = cfg.get<string>('DB_HOST') ?? 'localhost';
        const port = parseInt(cfg.get('DB_PORT') ?? '5433', 10);
        const needSsl =
          (cfg.get('DB_SSL') ?? '').toString().toLowerCase() === 'true' ||
          host.includes('render.com') ||
          host.includes('neon.tech') ||
          host.includes('amazonaws.com');

        return {
          type: 'postgres',
          host,
          port,
          username: cfg.get('DB_USERNAME') ?? 'postgres',
          password: cfg.get('DB_PASSWORD') ?? '',
          database: cfg.get('DB_NAME') ?? 'app',
          autoLoadEntities: true,
          synchronize: false,                            // ⛔️
          migrationsRun: true,                           // ✅
          migrations: [join(__dirname, 'migrations/*.{ts,js}')],
          ssl: needSsl ? { rejectUnauthorized: false } : false,
        };
      },
    }),

    TerminusModule,
    UserModule,
    AuthModule,
  ],
  controllers: [HealthController],
})
export class AppModule { }
