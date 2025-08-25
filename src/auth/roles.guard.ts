
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserPayload } from '../types/user-payload';



@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndMerge<string[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles.length) return true;

        const req = context.switchToHttp().getRequest();
        const user = req.user as UserPayload;
        if (!user?.role) return false;
        return requiredRoles.includes(user.role);

    }
}
