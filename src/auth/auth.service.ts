import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { LoginDto } from './dto/login.dto'; // ⬅️ додаємо DTO
import { CreateUserDto } from '../user/dto/create-user.dto';


type UserRole = User['role'];
interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.password);
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

  async signup(dto: CreateUserDto): Promise<{ message: string }> {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) throw new BadRequestException('Email already in use');

    await this.userService.create({
      ...dto,
      role: dto.role ?? 'user', // дефолт — user
    });

    return { message: 'User created successfully' };
  }
}

