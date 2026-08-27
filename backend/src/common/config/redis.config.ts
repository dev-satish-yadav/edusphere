import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

export const baseRedisOptions: any = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
  username: process.env.REDIS_USERNAME || undefined,
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB ?? '0', 10),
  tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
  connectTimeout: 30000,
  keepAlive: 30000,
  lazyConnect: false,
};

export const appRedisConfig: any = {
  ...baseRedisOptions,
  enableOfflineQueue: false,
  maxRetriesPerRequest: 3,
  reconnectOnError: () => true,
  retryStrategy: () => 10000,
};

export const bullRedisConfig: any = {
  ...baseRedisOptions,
  enableOfflineQueue: true,
  maxRetriesPerRequest: null,
  reconnectOnError: () => true,
  retryStrategy: () => 10000,
};
