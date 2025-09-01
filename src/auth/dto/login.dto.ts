// src/auth/dto/login.dto.ts
import { IsEmail, IsString, MinLength, IsOptional, IsBoolean, IsIn } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  // для "Remember me" (необов'язковий прапорець)
  @IsOptional()
  @IsBoolean()
  remember?: boolean;


   // нове керування TTL
  @IsOptional()
  @IsIn(['session', '1h', '30d'])
  ttl?: 'session' | '1h' | '30d';
}
