// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
  JwtFromRequestFunction,
} from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { UserRole } from '../user/user.entity';
import { UserPayload } from '../types/user-payload';
import { UsersService } from 'src/user/user.service';

type JwtPayload = { sub: number; email: string; role: UserRole };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly cfg: ConfigService,
    private readonly users: UsersService,
  ) {
    const cookieName = cfg.get<string>('COOKIE_NAME') ?? 'token';

    const cookieExtractor: JwtFromRequestFunction = (req: Request) => {
      const r = req as any;
      return r?.signedCookies?.[cookieName] ?? r?.cookies?.[cookieName] ?? null;
    };

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: cfg.getOrThrow<string>('JWT_SECRET'), // ✅ гарантує string
    });
  }

  // ⚠️ беремо актуальні дані з БД — роль буде завжди свіжа
  // async validate(payload: JwtPayload): Promise<UserPayload> {
  //   return { id: payload.sub, email: payload.email, role: payload.role };
  // }
  async validate(payload: JwtPayload): Promise<UserPayload> {
    const user = await this.users.findById(payload.sub);
    if (!user) throw new UnauthorizedException();
    return { id: user.id, email: user.email, role: user.role };
  }
}


