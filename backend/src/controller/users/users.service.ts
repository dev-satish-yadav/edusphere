import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { IMessageResponse, IDataResponse, IDataMessageResponse, IListResponse } from '../../common/interfaces/api-response.interface';
import { ILoginUserData, IUserData } from './interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import mConfig from '../../config/message.config.json';
import { isValidId } from '../../common/utils/mongodb.util';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserListDto } from './dto/user-list.dto';
import { sortFilterPagination } from '../../common/utils/functions.util';
import { ErrorlogService } from '../error-log/error-log.service';
import { UsersDAO } from './users.dao';
import { UserAccessTokenDAO } from './user-access-token.dao';
import { UserCacheService } from '../../cache/user-cache.service';
import * as crypto from 'crypto';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(
    private readonly usersDAO: UsersDAO,
    private readonly userAccessTokenDAO: UserAccessTokenDAO,
    private readonly errorlogService: ErrorlogService,
    private readonly userCacheService: UserCacheService,
  ) {}

  /**
   * Api for create user
   * @param createUserDto
   * @param res
   * @returns
   */
  public async create(createUserDto: CreateUserDto, res: Response): Promise<Response<IDataMessageResponse<IUserData> | IMessageResponse>> {
    try {
      const user = await this.usersDAO.findOne({ email: createUserDto.email });
      if (user) {
        return res.json({
          message: mConfig.Email_exist,
          success: false,
        });
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, SALT_ROUNDS);
      const userToCreate = {
        ...createUserDto,
        password: hashedPassword,
      };

      const data = await this.usersDAO.create(userToCreate);

      return res.json({
        data: data,
        message: mConfig.User_created,
        success: true,
      });
    } catch (error) {
      this.errorlogService.errorLog(error, 'src/controller/users/users.service.ts-create');
      return res.json({
        success: false,
        message: mConfig.Something_went_wrong,
      });
    }
  }

  /**
   * Api for user login
   * @param loginUserDto
   * @param res
   * @returns
   */
  public async login(loginUserDto: LoginUserDto, res: Response): Promise<Response<IDataMessageResponse<ILoginUserData> | IMessageResponse>> {
    try {
      const user = await this.usersDAO.findByEmailWithPassword(loginUserDto.email);

      if (!user || !(await bcrypt.compare(loginUserDto.password, user.password))) {
        return res.json({
          message: mConfig.Email_or_Password_wrong,
          success: false,
        });
      }

      if (!user.isActive) {
        return res.json({
          message: mConfig.Account_disabled,
          success: false,
        });
      }

      const token = crypto.randomBytes(30).toString('hex'); // 60 characters

      await this.userAccessTokenDAO.create({
        userId: user._id,
        token: token,
      });

      const userToCache = {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      };
      await this.userCacheService.addUserToCache(userToCache, token);

      return res.status(200).json({
        success: true,
        data: {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
          },
          token: token,
        },
        message: mConfig.Login_successful,
      });
    } catch (error) {
      this.errorlogService.errorLog(error, 'src/controller/users/users.service.ts-login');
      return res.json({
        success: false,
        message: mConfig.Something_went_wrong,
      });
    }
  }

  /**
   * Api for list users
   * @param userListDto
   * @param res
   * @returns
   */
  public async findAll(userListDto: UserListDto, res: Response): Promise<Response<IListResponse<IUserData> | IMessageResponse>> {
    try {
      const query = {};
      const sortData = {
        _id: '_id',
        email: 'email',
        name: 'name',
      };

      const totalRecord = await this.usersDAO.countDocuments(query);

      const {
        per_page,
        page,
        total_pages,
        prev_enable,
        next_enable,
        start_from,
        sort,
      } = sortFilterPagination(
        userListDto.page,
        userListDto.limit,
        totalRecord,
        sortData,
        userListDto.sort,
        userListDto.sort_type,
      );

      const items = await this.usersDAO.find(query, {
        skip: start_from,
        limit: per_page,
        sort: sort,
      });

      return res.json({
        data: items,
        success: true,
        total_count: totalRecord,
        prev_enable: prev_enable,
        next_enable: next_enable,
        total_pages: total_pages,
        per_page: per_page,
        page: page,
      });
    } catch (error) {
      this.errorlogService.errorLog(error, 'src/controller/users/users.service.ts-findAll');
      return res.json({
        success: false,
        message: mConfig.Something_went_wrong,
      });
    }
  }

  /**
   * Api for get one user
   * @param id
   * @param res
   * @returns
   */
  public async findOne(id: string, res: Response): Promise<Response<IDataResponse<IUserData> | IMessageResponse>> {
    try {
      if (!isValidId(id)) {
        return res.json({
          message: mConfig.Invalid_id,
          success: false,
        });
      }

      const user = await this.usersDAO.findById(id);
      if (!user) {
        return res.json({
          message: mConfig.User_not_found,
          success: false,
        });
      }

      return res.json({
        data: user,
        success: true,
      });
    } catch (error) {
      this.errorlogService.errorLog(error, 'src/controller/users/users.service.ts-findOne');
      return res.json({
        success: false,
        message: mConfig.Something_went_wrong,
      });
    }
  }

  /**
   * Api for update user
   * @param id
   * @param updateUserDto
   * @param res
   * @returns
   */
  public async update(
    id: string,
    updateUserDto: UpdateUserDto,
    res: Response,
  ): Promise<Response<IDataMessageResponse<IUserData> | IMessageResponse>> {
    try {
      if (!isValidId(id)) {
        return res.json({
          message: mConfig.Invalid_id,
          success: false,
        });
      }

      const user = await this.usersDAO.findByIdAndUpdate(id, updateUserDto);
      if (!user) {
        return res.json({
          message: mConfig.User_not_found,
          success: false,
        });
      }

      return res.json({
        data: user,
        message: mConfig.User_updated,
        success: true,
      });
    } catch (error) {
      this.errorlogService.errorLog(error, 'src/controller/users/users.service.ts-update');
      return res.json({
        success: false,
        message: mConfig.Something_went_wrong,
      });
    }
  }

  /**
   * Api for get user from token, used by UserGuard — no res, internal only.
   * @param token
   * @returns
   */
  public async findActiveByToken(token: string) {
    try {
      const cachedUser: any = await this.userCacheService.getUserCache(token);
      if (cachedUser) {
        return cachedUser.isActive ? cachedUser : null;
      }

      const userAccessToken = await this.userAccessTokenDAO.findOne({ token });
      if (!userAccessToken) return null;

      const user = await this.usersDAO.findById(userAccessToken.userId.toString());
      if (user?.isActive) {
        const userToCache = {
          _id: user._id,
          name: user.name,
          email: user.email,
          isActive: user.isActive,
        };
        await this.userCacheService.addUserToCache(userToCache, token);
        return userToCache;
      }
      return null;
    } catch (error) {
      this.errorlogService.errorLog(error, 'src/controller/users/users.service.ts-findActiveByToken');
      return null;
    }
  }
}

