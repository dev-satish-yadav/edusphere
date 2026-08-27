import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/guards/jwt-strategy';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { AdminModule } from './controller/admin/admin.module';
import { ErrorlogModule } from './controller/error-log/error-log.module';
import { UsersModule } from './controller/users/users.module';
import { CacheModule } from './cache/cache.module';
import { InstitutionsModule } from './controller/institutions/institutions.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

const modules: any = [];
modules.push(
  ThrottlerModule.forRoot([{
    ttl: 60000,
    limit: 100,
  }]),
  ConfigModule.forRoot({ isGlobal: true }),
  MongooseModule.forRoot(
    process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/edusphere',
  ),
  JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1d' },
  }),
  AuthModule,
  UsersModule,
  AdminModule,
  ErrorlogModule,
  CacheModule,
  InstitutionsModule,
);

@Module({
  imports: modules,
  providers: [
    JwtAuthGuard,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  //configure middleware
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('{*path}');
  }
}
