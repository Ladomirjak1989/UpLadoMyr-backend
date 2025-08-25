// src/auth/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from 'src/types/user-payload';

export const CurrentUser = createParamDecorator(
    (_: unknown, ctx: ExecutionContext): UserPayload => {
        const req = ctx.switchToHttp().getRequest();
        return req.user as UserPayload;
    },
);