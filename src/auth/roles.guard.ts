import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, AppRole } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const required = this.reflector.getAllAndOverride<AppRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // якщо ролі не задані — доступ відкритий
        if (!required || required.length === 0) return true;

        const req = context.switchToHttp().getRequest<{ user?: { role?: AppRole } }>();
        const role = req.user?.role;

        if (!role) throw new ForbiddenException('Forbidden');
        if (!required.includes(role)) throw new ForbiddenException('Insufficient role');

        return true;
    }
}
