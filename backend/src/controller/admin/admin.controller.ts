import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { ApiKeyGuard } from '../../auth/guards/api-key.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { AdminService } from './admin.service';
import { AdminListDto } from './dto/admin-list.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Api for create admin credential
   * @param createAdminDto
   * @param res
   * @returns
   */
  @Post('create')
  async create(@Body() createAdminDto: CreateAdminDto, @Res() res: Response) {
    return await this.adminService.create(createAdminDto, res);
  }

  /**
   * Api for admin login
   * @param loginAdminDto
   * @param res
   * @returns
   */
  @Post('login')
  async login(@Body() loginAdminDto: LoginAdminDto, @Res() res: Response) {
    return await this.adminService.login(loginAdminDto, res);
  }

  /**
   * Api for list admins
   * @param adminListDto
   * @param res
   * @returns
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('access-token')
  @Get('list')
  async findAll(@Query() adminListDto: AdminListDto, @Res() res: Response) {
    return await this.adminService.findAll(adminListDto, res);
  }

  /**
   * Api for get one admin
   * @param id
   * @param res
   * @returns
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('access-token')
  @Get('get/:id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    return await this.adminService.findOne(id, res);
  }

  /**
   * Api for update admin profile
   * @param id
   * @param updateAdminDto
   * @param res
   * @returns
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('access-token')
  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @Res() res: Response,
  ) {
    return await this.adminService.update(id, updateAdminDto, res);
  }

  /**
   * Api for delete admin
   * @param id
   * @param res
   * @returns
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('access-token')
  @Delete('delete/:id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    return await this.adminService.remove(id, res);
  }
}
