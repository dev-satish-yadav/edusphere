import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DAO } from '../../common/common.dao';
import { ErrorLog, ErrorLogDocument } from './entities/error-log.entity';

@Injectable()
export class ErrorLogDAO extends DAO<ErrorLogDocument> {
  constructor(
    @InjectModel(ErrorLog.name)
    private readonly errorLogModel: Model<ErrorLogDocument>,
  ) {
    super(errorLogModel);
  }
}
