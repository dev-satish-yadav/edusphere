import { Injectable } from '@nestjs/common';
import { CacheService } from './cache.service';

@Injectable()
export class UserCacheService {
  constructor(private readonly cacheService: CacheService) {}
  
  public async addUserToCache(result: any, token: string) {
    // 24 hours expiry in seconds
    const ttl = 86400; 
    
    await this.cacheService.addCacheToGroup(
      'user-token',
      token,
      result,
      ttl,
    );
  }

  public async getUserCache(token: string) {
    return await this.cacheService.getCacheFromGroup('user-token', token);
  }

  public async clearUserCache(token: string[]) {
    return await this.cacheService.deleteRedisKeys('user-token', token);
  }
}
