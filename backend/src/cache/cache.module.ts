import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import { CacheService } from './cache.service';
import { UserCacheService } from './user-cache.service';
import { appRedisConfig } from '../common/config/redis.config';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis(appRedisConfig);
      },
    },
    CacheService,
    UserCacheService,
  ],
  exports: ['REDIS_CLIENT', CacheService, UserCacheService],
})
export class CacheModule {}
