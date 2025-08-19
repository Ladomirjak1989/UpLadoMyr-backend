// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(configService: ConfigService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromExtractors([
//         (req) => req?.cookies?.token,
//       ]),
//       ignoreExpiration: false,
//       secretOrKey: configService.get<string>('JWT_SECRET') || '',
//     });
//   }

//   async validate(payload: any) { 
//     return { userId: payload.sub, email: payload.email, role: payload.role };
//   }
// }




// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

function cookieExtractor(req: Request): string | null {
  return req?.cookies?.token ?? null; // назва куки має збігатися з тим, що ти ставиш у login
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,                              // 1) з cookie
        ExtractJwt.fromAuthHeaderAsBearerToken(),     // 2) fallback: з Authorization
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET')!, // або getOrThrow у новішому Nest
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role ?? null };
  }
}

