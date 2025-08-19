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
//       password: process.env.DB_PASSWORD_NEW,
//       database: process.env.DB_NAME,
//       entities: [User],

//       synchronize: true,
//     }),

//     UserModule,
//     AuthModule, 
//   ],
// })
// export class AppModule { }


// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health/health.controller';

const isExternal = (process.env.DATABASE_URL ?? '').includes('.internal') === false;

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false, // <- фіксуємо вимкнено
      ssl: isExternal ? { rejectUnauthorized: false } : false,
    }),
    TerminusModule,
    UserModule,
    AuthModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}


