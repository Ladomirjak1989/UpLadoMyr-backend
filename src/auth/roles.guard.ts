
// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { Observable } from 'rxjs';
// import { UserPayload } from '../types/user-payload';



// @Injectable()
// export class RolesGuard implements CanActivate {
//     constructor(private reflector: Reflector) { }

//     canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
//         const requiredRoles = this.reflector.getAllAndMerge<string[]>('roles', [
//             context.getHandler(),
//             context.getClass(),
//         ]);
//         if (!requiredRoles.length) return true;

//         const req = context.switchToHttp().getRequest();
//         const user = req.user as UserPayload;
//         if (!user?.role) return false;
//         return requiredRoles.includes(user.role);

//     }
// }



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
