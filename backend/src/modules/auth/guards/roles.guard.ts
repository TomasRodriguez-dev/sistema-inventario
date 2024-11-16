import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/keys/public.key';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
        ]);
        if (!requiredRoles) {
        return true;
        }
        const { user } = context.switchToHttp().getRequest();
        const hasRole = requiredRoles.some((role) => user.rol?.includes(role));
        if (!hasRole) {
            throw new ForbiddenException('No tiene permiso para realizar esta acción');
        }
        return hasRole;
    }
}
