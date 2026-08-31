import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { IMessageResponse, IDataResponse, IDataMessageResponse, IListResponse } from '../../common/interfaces/api-response.interface';
import { ILoginAdminData, IAdminData } from './interfaces/admin.interface';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import mConfig from '../../config/message.config.json';
import { isValidId } from '../../common/utils/mongodb.util';
import { ErrorlogService } from '../error-log/error-log.service';
import { AdminDAO } from './admin.dao';
import { AdminListDto } from './dto/admin-list.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { sortFilterPagination } from '../../common/utils/functions.util';

const SALT_ROUNDS = 10;

@Injectable()
export class AdminService {
  constructor(
    private readonly adminDAO: AdminDAO,
    private readonly jwtService: JwtService,
    private readonly errorlogService: ErrorlogService,
  ) {}

  /**
   * Api for create admin credential
   * @param createAdminDto
   * @param res
   * @returns
   */
  public async create(createAdminDto: CreateAdminDto, res: Response): Promise<Response<IDataMessageResponse<IAdminData> | IMessageResponse>> {
    try {
      if (createAdminDto.secretCode !== '2000') {
        return res.json({
          message: 'invalid/wrong secret code',
          success: false,
        });
      }

      const admin = await this.adminDAO.findOne({ email: createAdminDto.email });
      if (admin) {
        return res.json({
          message: mConfig.Email_exist,
          success: false,
        });
      }

      //encrypt password
      const data = await this.adminDAO.create(await this.hashed(createAdminDto));

      return res.json({
        data: data,
        message: mConfig.Admin_created,
        success: true,
      });
    } catch (error) {
      this.errorlogService.errorLog(error, 'src/controller/admin/admin.service.ts-create');
      return res.json({
        success: false,
        message: mConfig.Something_went_wrong,
      });
    }
  }

  /**
   * Api for admin login
   * @param loginAdminDto
   * @param res
   * @returns
   */
  public async login(loginAdminDto: LoginAdminDto, res: Response): Promise<Response<IDataMessageResponse<ILoginAdminData> | IMessageResponse>> {
    try {
      const admin = await this.adminDAO.findByEmailWithPassword(loginAdminDto.email);

      // Same message either way — do not leak which emails exist.
      if (!admin || !(await bcrypt.compare(loginAdminDto.password, admin.password))) {
        return res.json({
          message: mConfig.Email_or_Password_wrong,
          success: false,
        });
      }

      if (!admin.isActive) {
        return res.json({
          message: mConfig.Account_disabled,
          success: false,
        });
      }

      //generate auth token
      const token = await this.jwtService.signAsync({
        sub: admin.id,
        email: admin.email,
        role: admin.role,
      });

      return res.status(200).json({
        success: true,
        data: {
          user: {
            _id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
          },
          token: token,
        },
        message: mConfig.Login_successful,
      });
    } catch (error) {
      this.errorlogService.errorLog(error, 'src/controller/admin/admin.service.ts-login');
      return res.json({
        success: false,
        message: mConfig.Something_went_wrong,
      });
    }
  }

  /**
   * Api for list admins
   * @param adminListDto
   * @param res
   * @returns
   */
  public async findAll(adminListDto: AdminListDto, res: Response): Promise<Response<IListResponse<IAdminData> | IMessageResponse>> {
    try {
      const query = {};
      const sortData = {
        _id: '_id',
        email: 'email',
        name: 'name',
        role: 'role',
      };

      const totalRecord = await this.adminDAO.countDocuments(query);

      const {
        per_page,
        page,
        total_pages,
        prev_enable,
        next_enable,
        start_from,
        sort,
      } = sortFilterPagination(
        adminListDto.page,
        adminListDto.limit,
        totalRecord,
        sortData,
        adminListDto.sort,
        adminListDto.sort_type,
      );

      const items = await this.adminDAO.find(query, {
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
      this.errorlogService.errorLog(error, 'src/controller/admin/admin.service.ts-findAll');
      return res.json({
        success: false,
        message: mConfig.Something_went_wrong,
      });
    }
  }

  /**
   * Api for get one admin
   * @param id
   * @param res
   * @returns
   */
  public async findOne(id: string, res: Response): Promise<Response<IDataResponse<IAdminData> | IMessageResponse>> {
    try {
      if (!isValidId(id)) {
        return res.json({
          message: mConfig.Invalid_id,
          success: false,
        });
      }

      const admin = await this.adminDAO.findById(id);
      if (!admin) {
        return res.json({
          message: mConfig.Admin_not_found,
          success: false,
        });
      }

      return res.json({
        data: admin,
        success: true,
      });
    } catch (error) {
      this.errorlogService.errorLog(error, 'src/controller/admin/admin.service.ts-findOne');
      return res.json({
        success: false,
        message: mConfig.Something_went_wrong,
      });
    }
  }

  /**
   * Api for update admin profile
   * @param id
   * @param updateAdminDto
   * @param res
   * @returns
   */
  public async update(
    id: string,
    updateAdminDto: UpdateAdminDto,
    res: Response,
  ): Promise<Response<IDataMessageResponse<IAdminData> | IMessageResponse>> {
    try {
      if (!isValidId(id)) {
        return res.json({
          message: mConfig.Invalid_id,
          success: false,
        });
      }

      //re-encrypt password when it is being changed
      const admin = await this.adminDAO.findByIdAndUpdate(
        id,
        await this.hashed(updateAdminDto),
      );
      if (!admin) {
        return res.json({
          message: mConfig.Admin_not_found,
          success: false,
        });
      }

      return res.json({
        data: admin,
        message: mConfig.Admin_updated,
        success: true,
      });
    } catch (error) {
      this.errorlogService.errorLog(error, 'src/controller/admin/admin.service.ts-update');
      return res.json({
        success: false,
        message: mConfig.Something_went_wrong,
      });
    }
  }

  /**
   * Api for delete admin
   * @param id
   * @param res
   * @returns
   */
  public async remove(id: string, res: Response): Promise<Response<IDataMessageResponse<IAdminData> | IMessageResponse>> {
    try {
      if (!isValidId(id)) {
        return res.json({
          message: mConfig.Invalid_id,
          success: false,
        });
      }

      const admin = await this.adminDAO.findByIdAndDelete(id);
      if (!admin) {
        return res.json({
          message: mConfig.Admin_not_found,
          success: false,
        });
      }

      return res.json({
        message: mConfig.Admin_deleted,
        success: true,
      });
    } catch (error) {
      this.errorlogService.errorLog(error, 'src/controller/admin/admin.service.ts-remove');
      return res.json({
        success: false,
        message: mConfig.Something_went_wrong,
      });
    }
  }

  /**
   * Api for get admin from given id, used by AdminGuard — no res, internal only.
   * @param id
   * @returns
   */
  public async findActive(id: string) {
    try {
      const admin = await this.adminDAO.findById(id);
      return admin?.isActive ? admin : null;
    } catch (error) {
      this.errorlogService.errorLog(error, 'src/controller/admin/admin.service.ts-findActive');
      return null;
    }
  }

  private async hashed<T extends { password?: string }>(dto: T) {
    if (!dto.password) return dto;
    return { ...dto, password: await bcrypt.hash(dto.password, SALT_ROUNDS) };
  }
}
