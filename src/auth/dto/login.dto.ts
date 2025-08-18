// src/auth/dto/login.dto.ts
import { IsEmail, IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';

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
}
