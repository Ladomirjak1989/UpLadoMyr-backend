// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Res, Get, HttpCode, Header } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import type { CookieOptions } from 'express-serve-static-core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { UserPayload } from '../types/user-payload';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CurrentUser } from './current-user.decorator';

const isProd = process.env.NODE_ENV === 'production';
const COOKIE_NAME = process.env.COOKIE_NAME || 'token';

// Базові опції для куки (щоб не дублювати всюди)
const baseCookieOpts: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax', // різні домени → 'none'; один сайт → 'lax'
  path: '/', // важливо для правильного видалення
  signed: Boolean(process.env.COOKIE_SECRET), // якщо є секрет — підписуємо
  // domain: '.upladomyr.com',    // ДОДАЄШ лише коли бек і фронт на одному апексі з піддоменами
};

@Controller('auth')    // -> /api/auth/...
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
    res.cookie('token', access_token, opts);
    return { message: 'Login successful' };
  }



  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    return this.authService.signup(body);
  }



  // /auth/me — витягуємо дані з токена
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @Header('Cache-Control', 'no-store')    // не кешувати — жодних 304
  getMe(@CurrentUser() user: UserPayload) {
    return user;
  }

  // LOGOUT — видаляємо куку по тим самим базовим опціям
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(COOKIE_NAME, { ...baseCookieOpts, maxAge: 0 });
    return { message: 'Logged out' };
  }
}
