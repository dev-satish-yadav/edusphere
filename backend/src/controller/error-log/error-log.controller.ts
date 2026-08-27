import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { DeleteErrorLogDto } from './dto/delete-error-log.dto';
import { ErrorLogListDto } from './dto/error-log-list.dto';
import { ErrorlogService } from './error-log.service';

@Controller('errorlog')
@ApiTags('Error Log')
export class ErrorlogController {
  constructor(private readonly errorLogService: ErrorlogService) {}

  /**
   * Api for error log list
   * @param errorLogListDto
   * @param res
   * @returns
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('access-token')
  @Get('list')
  async findAll(@Query() errorLogListDto: ErrorLogListDto, @Res() res: Response) {
    return await this.errorLogService.findAll(errorLogListDto, res);
  }

  /**
   * Api for delete multiple errorLog
   * @param deleteErrorLogDto
   * @param res
   * @returns
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('access-token')
  @Delete('delete-multiple')
  async deleteManyErrorLog(
    @Body() deleteErrorLogDto: DeleteErrorLogDto,
    @Res() res: Response,
  ) {
    return await this.errorLogService.deleteManyErrorLog(deleteErrorLogDto, res);
  }

  /**
   * Api for delete errorLog
   * @param id
   * @param res
   * @returns
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('access-token')
  @Delete('delete/:id')
  async deleteErrorLog(@Param('id') id: string, @Res() res: Response) {
    return await this.errorLogService.deleteErrorLog(id, res);
  }
}
