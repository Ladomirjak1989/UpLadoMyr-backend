// src/auth/strategies/google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

type GoogleProfile = {
  id: string;
  displayName?: string;
  emails?: { value: string }[];
  photos?: { value: string }[];
};

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(cfg: ConfigService) {
    // 1) готуємо все ДО виклику super()
    const isProd = process.env.NODE_ENV === 'production';

    // фронтовий домен (де стоїть кука), з запасними дефолтами
    const FRONTEND_URL =
      (isProd ? process.env.FRONTEND_URL_PROD : process.env.FRONTEND_LOCALHOST_URL) ??
      (isProd ? 'https://upladomyr.com' : 'http://localhost:3000');

    const clientID = cfg.getOrThrow<string>('GOOGLE_CLIENT_ID');
    const clientSecret = cfg.getOrThrow<string>('GOOGLE_CLIENT_SECRET');

    // критично: callback ПОВИНЕН бути на фронтовому домені
    const callbackURL = `${FRONTEND_URL.replace(/\/$/, '')}/api/auth/google/callback`;

    // 2) викликаємо super()
    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['profile', 'email'],
    });

    // 3) діагностичний лог без секретів
    console.log('[GoogleStrategy]', {
      clientIdLen: clientID.length,
      callbackURL,
      env: isProd ? 'prod' : 'dev',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: (err: any, user?: any) => void,
  ) {
    // повертаємо мінімальний профіль для подальшої обробки у контролері
    return done(null, {
      provider: 'google' as const,
      providerId: profile.id,
      email: profile.emails?.[0]?.value ?? null,
      displayName: profile.displayName ?? null,
      avatarUrl: profile.photos?.[0]?.value ?? null,
    });
  }
}
