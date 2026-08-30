import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

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
    // Check if the user has at least one of the required roles in userType or populated roles
    if (requiredRoles.includes(user?.userType)) {
      return true;
    }
    
    // Fallback if roles array is populated with actual names
    const userRoleNames = user?.roles?.map((r: any) => r.name) || [];
    return requiredRoles.some((role) => userRoleNames.includes(role));
  }
}
