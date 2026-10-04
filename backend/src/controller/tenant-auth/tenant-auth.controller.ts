import { Controller, Post, Body, HttpCode, HttpStatus, Get, Param } from '@nestjs/common';
import { TenantAuthService } from './tenant-auth.service';
import { TenantLoginDto } from './dto/tenant-login.dto';

@Controller('tenant-auth')
export class TenantAuthController {
  constructor(private readonly tenantAuthService: TenantAuthService) {}

  @Get('verify/:slug')
  verify(@Param('slug') slug: string) {
    return this.tenantAuthService.verifyTenant(slug);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: TenantLoginDto) {
    return this.tenantAuthService.login(loginDto);
  }
}
