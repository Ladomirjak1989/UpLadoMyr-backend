import { IsIn } from 'class-validator';
import { UserRole } from '../user.entity';

export class UpdateRoleDto {
  @IsIn(['user', 'admin'])
  role!: UserRole;
}
