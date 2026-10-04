import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/guards/jwt-strategy';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { TenantMiddleware } from './common/middlewares/tenant.middleware';
import { AdminModule } from './controller/admin/admin.module';
import { ErrorlogModule } from './controller/error-log/error-log.module';
import { UsersModule } from './controller/users/users.module';
import { CacheModule } from './cache/cache.module';
import { InstitutionsModule } from './controller/institutions/institutions.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { RolesModule } from './controller/roles/roles.module';
import { PermissionsModule } from './controller/permissions/permissions.module';
import { TenantsModule } from './tenants/tenants.module';
import { TenantAuthModule } from './controller/tenant-auth/tenant-auth.module';

const modules: any = [];
modules.push(
  ThrottlerModule.forRoot([{
    ttl: 60000,
    limit: 100,
  }]),
  ConfigModule.forRoot({ isGlobal: true }),
  MongooseModule.forRoot(
    process.env.MONGODB_URI ?? 'mongodb://localhost:27017/edusphere',
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
  TenantsModule,
  TenantAuthModule,
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
    consumer.apply(TenantMiddleware)
      .exclude('auth/super-admin', 'user/login', 'tenant-auth/login', 'tenant-auth/verify/(.*)')
      .forRoutes('*');
  }
}
