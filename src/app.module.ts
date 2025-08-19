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

const isExternal =
  (process.env.DATABASE_URL ?? '').includes('.internal') === false;

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,       // <-- єдина канонічна змінна
      autoLoadEntities: true,
      synchronize: process.env.DB_SYNC === 'true', // див. крок 3
      ssl: isExternal ? { rejectUnauthorized: false } : false, // External -> SSL, Internal -> без SSL
    }),
    UserModule,
    AuthModule,
  ],
})
export class AppModule { }


