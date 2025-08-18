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
      password: process.env.DB_PASSWORD_NEW,
      database: process.env.DB_NAME,
      entities: [User],

      synchronize: true,
    }),

    UserModule,
    AuthModule, 
  ],
})
export class AppModule { }


// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { UserModule } from './user/user.module';
// import { AuthModule } from './auth/auth.module';

// @Module({
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true }),

//     TypeOrmModule.forRootAsync({
//       inject: [ConfigService],
//       useFactory: (cfg: ConfigService) => ({
//         type: 'postgres',
//         host: cfg.get<string>('DB_HOST'),
//         port: parseInt(cfg.get('DB_PORT') ?? '5433', 10),
//         username: cfg.get<string>('DB_USERNAME'),
//         password: cfg.get<string>('DB_PASSWORD_NEW'),
//         database: cfg.get<string>('DB_NAME'),
//         autoLoadEntities: true,       // зручніше за entities:[User]
//         synchronize: false,           // true тільки в деві, на проді краще міграції
//         ssl: process.env.NODE_ENV === 'production'
//           ? { rejectUnauthorized: false }
//           : false,
//         // logging: true, // тимчасово для діагностики
//       }),
//     }),

//     UserModule,
//     AuthModule,
//   ],
// })
// export class AppModule { }

