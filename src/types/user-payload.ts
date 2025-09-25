// src/types/user-payload.ts
import { UserRole } from '../user/user.entity';

export interface UserPayload {
  id: number;
  email: string | null;
  role: UserRole;   // 👈 enum, не 'user' | 'admin'
}


