// // 1. app.module.ts signup, signin для locslhost 5000!!!

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





// //2. app.module.ts signup, signin для продакшена!!!

// // import { Module } from '@nestjs/common';
// // import { TypeOrmModule } from '@nestjs/typeorm';
// // import { ConfigModule } from '@nestjs/config';
// // import { UserModule } from './user/user.module';
// // import { AuthModule } from './auth/auth.module';
// // import { TerminusModule } from '@nestjs/terminus';
// // import { HealthController } from './health/health.controller';

// // const isExternal = (process.env.DATABASE_URL ?? '').includes('.internal') === false;

// // @Module({
// //   imports: [
// //     ConfigModule.forRoot({ isGlobal: true }),
// //     TypeOrmModule.forRoot({
// //       type: 'postgres',
// //       url: process.env.DATABASE_URL,
// //       autoLoadEntities: true,
// //       synchronize: false, // <- фіксуємо вимкнено
// //       ssl: isExternal ? { rejectUnauthorized: false } : false,
// //     }),
// //     TerminusModule,
// //     UserModule,
// //     AuthModule,
// //   ],
// //   controllers: [HealthController],
// // })
// // export class AppModule { }



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
          migrations: [join(__dirname, 'migrations/*.{js,ts}')],
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
