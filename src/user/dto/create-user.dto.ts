// src/user/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../user.entity';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Username is required' })
  username!: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;

  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be either user or admin' })
  role?: UserRole;     // 👈 тепер це enum
}


