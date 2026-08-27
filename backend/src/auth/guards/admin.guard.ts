import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminService } from '../../controller/admin/admin.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly adminService: AdminService) {}

  //Function for authorize admin
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    const result = await this.adminService.findActive(user.sub);
    // Throw rather than return false: a stale token is a 401, not a 403.
    if (!result) {
      throw new UnauthorizedException('Admin no longer active');
    }
    user._id = user.sub;
    user.active_type = 'admin';
    user.name = result.name;
    user.email = result.email;
    user.role = result.role;
    return true;
  }
}
