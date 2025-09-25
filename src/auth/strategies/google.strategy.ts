// src/auth/strategies/google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(cfg: ConfigService) {
    // 1) зчитаємо env у локальні константи
    const clientID = cfg.getOrThrow<string>('GOOGLE_CLIENT_ID');
    const clientSecret = cfg.getOrThrow<string>('GOOGLE_CLIENT_SECRET');
    const callbackURL = cfg.getOrThrow<string>('GOOGLE_CALLBACK_URL');

    // 2) тепер безпечно викликаємо super(...)
    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['profile', 'email'],
    });

    // (опц.) діагностичний лог — БЕЗ секретів
    console.log('[GoogleStrategy]', {
      clientIdLen: clientID.length,
      callbackURL,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err: any, user?: any) => void,
  ) {
    return done(null, {
      provider: 'google',
      providerId: profile.id,
      email: profile.emails?.[0]?.value ?? null,
      displayName: profile.displayName ?? null,
      avatarUrl: profile.photos?.[0]?.value ?? null,
    });
  }
}


