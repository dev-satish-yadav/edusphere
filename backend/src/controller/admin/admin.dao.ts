import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DAO } from '../../common/common.dao';
import { Admin, AdminDocument } from './entities/admin.entity';

@Injectable()
export class AdminDAO extends DAO<AdminDocument> {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: Model<AdminDocument>,
  ) {
    super(adminModel);
  }

  /**
   * Function for get admin by email, hash included — login only.
   * @param email
   * @returns
   */
  async findByEmailWithPassword(email: string) {
    return this.adminModel
      .findOne({ email: email.toLowerCase() })
      .select('+password')
      .exec();
  }
}
