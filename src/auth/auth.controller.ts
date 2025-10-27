// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Res,
  Get,
  HttpCode,
  Header,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';                 // [ADD] type-імпорт Request
import type { CookieOptions } from 'express-serve-static-core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { UserPayload } from '../types/user-payload';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CurrentUser } from './current-user.decorator';
import { AuthGuard } from '@nestjs/passport';



const isProd = process.env.NODE_ENV === 'production';
const COOKIE_NAME = process.env.COOKIE_NAME || 'token';

// Базові опції для куки (щоб не дублювати всюди)
const baseCookieOpts: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax', // різні домени → 'none'; один сайт → 'lax'
  path: '/', // важливо для правильного видалення
  signed: !!process.env.COOKIE_SECRET, // якщо є секрет — підписуємо
  // domain: '.upladomyr.com', // ДОДАЄШ лише коли бек і фронт на одному апексі з піддоменами
};

// [ADD] Описуємо, що саме кладе GoogleStrategy у req.user
type GoogleProfile = {
  provider: 'google';
  providerId: string;
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
};
// [ADD] Розширений тип реквеста з user
type GoogleRequest = Request & { user: GoogleProfile };


// Визначаємо куди редіректити на фронті
function getFrontendOrigin(): string {
  const origin =
    process.env.FRONTEND_URL ||                          // універсальна, якщо задана
    (isProd
      ? process.env.FRONTEND_URL_PROD                   // прод-URL фронта
      : process.env.FRONTEND_LOCALHOST_URL) ||          // dev-URL фронта
    (isProd ? 'https://upladomyr.com' : 'http://localhost:3000'); // дефолти

  return origin.replace(/\/$/, ''); // прибрати трейлінг-слеш
}

@Controller('auth') // -> /api/auth/...
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { access_token } = await this.authService.login(dto);

    // Копія базових опцій + TTL залежно від remember
    const opts: CookieOptions = { ...baseCookieOpts };

    // Пріоритет: ttl > remember (для зворотної сумісності)
    const ttl = dto.ttl ?? (dto.remember ? '30d' : '1h');

    switch (ttl) {
      case '30d':
        opts.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 днів
        break;
      case '1h':
        opts.maxAge = 60 * 60 * 1000; // 1 година
        break;
      case 'session':
      default:
        delete opts.maxAge; // сесійна кука
        break;
    }

    // Ім'я куки узгоджуй з JwtStrategy!
    res.cookie(COOKIE_NAME, access_token, opts);
    return { message: 'Login successful' };
  }

  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    return this.authService.signup(body);
  }

  // /auth/me — витягуємо дані з токена
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @Header('Cache-Control', 'no-store') // не кешувати — жодних 304
  getMe(@CurrentUser() user: UserPayload) {
    return user;
  }

  // LOGOUT — видаляємо куку по тим самим базовим опціям
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(COOKIE_NAME, { ...baseCookieOpts, maxAge: 0 });
    return { message: 'Logged out' };
  }


  // ---------- Diagnostics ----------

  @Get('ping')
  ping() {
    console.log('[auth/ping] hit');
    return { ok: true };
  }

  // -------- Google OAuth --------

  // [ADD] Старт Google OAuth (редірект на Google)
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleStart() {
    console.log('[auth/google] start → redirecting to Google…');

    // Passport сам зробить редірект на Google
  }

  // [ADD] Callback від Google
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: GoogleRequest, @Res() res: Response) {


    // req.user надає GoogleStrategy.validate
    const profile = req.user; // типізовано

    const user = await this.authService.findOrCreateGoogleUser(profile);

    // Підписуємо JWT на 30 днів — як твій remember
    const access_token = await this.authService.signForUser(user, '30d');


    // Ставимо куку з тим самим набором опцій, що й у /login (remember=30d)
    const opts: CookieOptions = {
      ...baseCookieOpts,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      // ВАЖЛИВО: якщо фронт на іншому домені, у проді має бути sameSite:'none' і secure:true (вже є)
    };
    res.cookie(COOKIE_NAME, access_token, opts);


    // редіректимо на фронт — сторінка, яка добере /auth/me і перекине куди треба
    const frontend = getFrontendOrigin();
    console.log('[auth/google/callback] redirect →', frontend);
    return res.redirect(frontend + '/'); // на головну
  }
}

