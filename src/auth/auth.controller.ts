// src/auth/auth.controller.ts
import { Controller, Post, Body, Req, UseGuards, Res, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import type { CookieOptions } from 'express-serve-static-core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';


import { UserPayload } from '../types/user-payload';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CurrentUser } from './current-user.decorator';

const isProd = process.env.NODE_ENV === 'production';

// Базові опції для куки (щоб не дублювати всюди)
const baseCookieOpts: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  path: '/', // важливо для правильного видалення
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { access_token } = await this.authService.login(dto);

    // Копія базових опцій + TTL залежно від remember
    const opts: CookieOptions = { ...baseCookieOpts };
    // ВАРІАНТ A (фіксований TTL для обох випадків)
    opts.maxAge = dto.remember
      ? 30 * 24 * 60 * 60 * 1000 // 30 днів
      : 60 * 60 * 1000;          // 1 година

    // ВАРІАНТ B (сесійна кука без maxAge, якщо не remember):
    // if (dto.remember) opts.maxAge = 30 * 24 * 60 * 60 * 1000;


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
  getMe(@CurrentUser() user: UserPayload) {
    return user;
  }

  // LOGOUT — видаляємо куку по тим самим базовим опціям
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', baseCookieOpts);
    return { message: 'Logged out' };
  }
}
