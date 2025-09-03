import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from '../types/user-payload';

export const CurrentUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): UserPayload => {
        const req = ctx.switchToHttp().getRequest();
        return req.user as UserPayload;
    },
);
