import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import mConfig from '../../config/message.config.json';
import { isValidId } from '../../common/utils/mongodb.util';
import { DeleteErrorLogDto } from './dto/delete-error-log.dto';
import { ErrorLogListDto } from './dto/error-log-list.dto';
import { ErrorLogDAO } from './error-log.dao';
import { sortFilterPagination } from '../../common/utils/functions.util';

@Injectable()
export class ErrorlogService {
  constructor(
    @Inject(REQUEST) private readonly request: any,
    private readonly errorLogDAO: ErrorLogDAO,
  ) {}

  /**
   * Function for store the error in the error_logs collection.
   * Never throws: a logging failure must not break the request that caused it.
   * @param value
   * @param file
   * @param body
   * @returns
   */
  public async errorLog(value: any, file: string, body: any = null) {
    try {
      const obj = {
        error_name: value?.name ? value.name : '',
        error_message: value?.message ? value.message : '',
        error_path: value?.stack ? value.stack : String(value),
        error_file: file || '',
        body: body,
        ip:
          this.request?.headers?.['x-forwarded-for'] || this.request?.ip || '',
      };
      await this.errorLogDAO.create(obj);
    } catch {
      return [];
    }
  }

  /**
   * Api for list ErrorLog for admin
   * @param errorLogListDto
   * @param res
   * @returns
   */
  public async findAll(errorLogListDto: ErrorLogListDto, res: any): Promise<any> {
    try {
      const query = {};
      const sortData = {
        _id: '_id',
        error_name: 'error_name',
        error_message: 'error_message',
        error_file: 'error_file',
        createdAt: 'createdAt',
      };

      const totalRecord = await this.errorLogDAO.countDocuments(query);

      const {
        per_page,
        page,
        total_pages,
        prev_enable,
        next_enable,
        start_from,
        sort,
      } = sortFilterPagination(
        errorLogListDto.page,
        errorLogListDto.limit,
        totalRecord,
        sortData,
        errorLogListDto.sort,
        errorLogListDto.sort_type,
      );

      const items = await this.errorLogDAO.find(query, {
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
      this.errorLog(error, 'src/controller/error-log/error-log.service.ts-findAll');
      return res.json({
        success: false,
        message: mConfig.Something_went_wrong,
      });
    }
  }

  /**
   * Api for delete errorLog
   * @param id
   * @param res
   * @returns
   */
  public async deleteErrorLog(id: string, res: any): Promise<any> {
    try {
      if (!isValidId(id)) {
        return res.json({
          message: mConfig.Invalid_id,
          success: false,
        });
      }

      const errorLog = await this.errorLogDAO.findByIdAndDelete(id);
      if (!errorLog) {
        return res.json({
          message: mConfig.Error_log_not_found,
          success: false,
        });
      }

      return res.json({
        message: mConfig.Error_log_deleted,
        success: true,
      });
    } catch (error) {
      this.errorLog(
        error,
        'src/controller/error-log/error-log.service.ts-deleteErrorLog',
      );
      return res.json({
        success: false,
        message: mConfig.Something_went_wrong,
      });
    }
  }

  /**
   * Api for delete multiple errorLog
   * @param deleteErrorLogDto
   * @param res
   * @returns
   */
  public async deleteManyErrorLog(
    deleteErrorLogDto: DeleteErrorLogDto,
    res: any,
  ): Promise<any> {
    try {
      const result = await this.errorLogDAO.deleteMany({
        _id: { $in: deleteErrorLogDto.ids },
      });

      return res.json({
        data: { deleted_count: result.deletedCount },
        message: mConfig.Error_logs_deleted,
        success: true,
      });
    } catch (error) {
      this.errorLog(
        error,
        'src/controller/error-log/error-log.service.ts-deleteManyErrorLog',
      );
      return res.json({
        success: false,
        message: mConfig.Something_went_wrong,
      });
    }
  }
}
