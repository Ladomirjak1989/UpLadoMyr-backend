import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../user/user.service';
import { User, UserRole } from '../user/user.entity';
import { LoginDto } from './dto/login.dto'; // ⬅️ додаємо DTO
import { CreateUserDto } from '../user/dto/create-user.dto';


interface JwtPayload {
  sub: number;
  email: string;
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

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  // login тепер приймає LoginDto і виставляє expiresIn залежно від remember
  async login(dto: LoginDto): Promise<{ access_token: string; expiresIn: string }> {
    const user = await this.validateUser(dto.email, dto.password);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // Якщо remember -> 30 днів, інакше 1 година
    const expiresIn = dto.remember ? '30d' : '1h';

    const access_token = await this.jwtService.signAsync(payload, { expiresIn });

    return { access_token, expiresIn };
  }

  // ⬇️ ПУБЛІЧНИЙ SIGNUP — роль завжди USER, ігноруємо будь-яке dto.role
  async signup(dto: CreateUserDto): Promise<{ message: string }> {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) throw new BadRequestException('Email already in use');

    await this.userService.create({
      username: dto.username,
      email: dto.email,
      password: dto.password,
      role: UserRole.USER, // 🔒 фіксовано
    });

    return { message: 'User created successfully' };
  }
}

