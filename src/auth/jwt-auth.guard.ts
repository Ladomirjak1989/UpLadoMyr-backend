// src/auth/jwt-auth.guard.ts
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user as TUser;
  }
}


