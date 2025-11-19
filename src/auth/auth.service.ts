// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../user/user.service';
import { User, UserRole } from '../user/user.entity';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';

interface JwtPayload {
  sub: number;
  email: string | null;           // [FIX] email може бути null для OAuth
  role: UserRole;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // [FIX] якщо акаунт створений через OAuth — пароля немає
    if (!user.passwordHash) {
      throw new UnauthorizedException('Password login is not available for this account');
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  // login приймає LoginDto і виставляє expiresIn залежно від remember
  async login(dto: LoginDto): Promise<{ access_token: string; expiresIn: string }> {
    const user = await this.validateUser(dto.email, dto.password);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email ?? null,   // [FIX] узгоджено з nullable email
      role: user.role,
    };

    // Якщо remember -> 30 днів, інакше 1 година
    const expiresIn = dto.remember ? '30d' : '12h';

    const access_token = await this.jwtService.signAsync(payload, { expiresIn });

    return { access_token, expiresIn };
  }

  // Публічний SIGNUP — роль завжди USER
  async signup(dto: CreateUserDto): Promise<{ message: string }> {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) throw new BadRequestException('Email already in use');

    await this.userService.create({
      username: dto.username,
      email: dto.email,
      password: dto.password,
      role: UserRole.USER,
    });

    return { message: 'User created successfully' };
  }

  //Google логін 
  // [ADD] Уніфікований підпис JWT для будь-якого користувача
  async signForUser(user: User, expiresIn: string): Promise<string> {
    const payload: JwtPayload = { sub: user.id, email: user.email ?? null, role: user.role };
    return this.jwtService.signAsync(payload, { expiresIn });
  }

  // [ADD] Логіка find-or-create для Google
  async findOrCreateGoogleUser(googleUser: {
    provider: 'google';
    providerId: string;
    email: string | null;
    displayName: string | null;
    avatarUrl: string | null;
  }): Promise<User> {
    // 1) шукаємо по provider/providerId
    let user = await this.userService.findByProvider('google', googleUser.providerId);

    // 2) якщо нема — пробуємо по email (merge з наявним акаунтом)
    if (!user && googleUser.email) {
      const byEmail = await this.userService.findByEmail(googleUser.email);
      if (byEmail) {
        user = await this.userService.linkProvider(
          byEmail.id,
          'google',
          googleUser.providerId,
          googleUser.avatarUrl,
          googleUser.displayName
        );
      }
    }

    // 3) якщо й досі нема — створюємо OAuth-юзера
    if (!user) {
      user = await this.userService.createOAuthUser({
        email: googleUser.email,
        displayName: googleUser.displayName,
        avatarUrl: googleUser.avatarUrl,
        provider: 'google',
        providerId: googleUser.providerId,
      });
    }

    return user;
  }
}
