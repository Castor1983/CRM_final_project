import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRole = this.reflector.get<string[]>('role', context.getHandler());
        if (!requiredRole) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const manager = request.manager;

        if (!manager || !manager.role) {
            throw new ForbiddenException('Access denied: Manager role not found');
        }


        const role = manager.role
        if (role !== requiredRole) {
            throw new ForbiddenException('Access denied: Insufficient rights');
        }

        return role;
    }
}