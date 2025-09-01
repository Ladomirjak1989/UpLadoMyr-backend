// src/user/dto/update-role.dto.ts
import { IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole } from '../user.entity';

export class UpdateRoleDto {
  @Transform(({ value }) => String(value).toLowerCase())
  @IsEnum(UserRole, { message: 'role must be one of: admin, user' })
  role!: UserRole;
}


