import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { timingSafeEqual } from 'crypto';

/**
 * Guards admin signup with a shared secret from ADMIN_API_KEY.
 * Drop it once the first admin exists and invites are a real flow.
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  //Function for authorize the shared api key
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const expected = process.env.ADMIN_API_KEY;
    if (!expected) {
      throw new UnauthorizedException('ADMIN_API_KEY is not configured');
    }
    const provided = request.header('x-api-key') ?? '';
    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new UnauthorizedException('Invalid API key');
    }
    return true;
  }
}
