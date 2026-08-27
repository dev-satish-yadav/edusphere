import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../../controller/users/users.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  //Function for authorize user
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token not provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid token format');
    }

    const result = await this.usersService.findActiveByToken(token);
    
    // Throw rather than return false: a stale token is a 401, not a 403.
    if (!result) {
      throw new UnauthorizedException('User no longer active or invalid token');
    }

    // if user is not defined in req, define it
    if (!request.user) {
      request.user = {};
    }

    request.user._id = result.id;
    request.user.active_type = 'user';
    request.user.name = result.name;
    request.user.email = result.email;
    
    return true;
  }
}
