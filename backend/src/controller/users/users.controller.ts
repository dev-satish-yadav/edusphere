import { Body, Controller, Get, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserListDto } from './dto/user-list.dto';
import { UsersService } from './users.service';
import { UserGuard } from '../../auth/guards/user.guard';

@Controller('user')
@ApiTags('User')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Api for create user
   * @param createUserDto
   * @param res
   * @returns
   */
  @Post('create')
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    return await this.usersService.create(createUserDto, res);
  }

  /**
   * Api for user login
   * @param loginUserDto
   * @param res
   * @returns
   */
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    return await this.usersService.login(loginUserDto, res);
  }

  /**
   * Api for list users
   * @param userListDto
   * @param res
   * @returns
   */
  @UseGuards(UserGuard)
  @Get('list')
  async findAll(@Query() userListDto: UserListDto, @Res() res: Response) {
    return await this.usersService.findAll(userListDto, res);
  }

  /**
   * Api for get one user
   * @param id
   * @param res
   * @returns
   */
  @UseGuards(UserGuard)
  @Get('get/:id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    return await this.usersService.findOne(id, res);
  }

  /**
   * Api for update user
   * @param id
   * @param updateUserDto
   * @param res
   * @returns
   */
  @UseGuards(UserGuard)
  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    return await this.usersService.update(id, updateUserDto, res);
  }
}
