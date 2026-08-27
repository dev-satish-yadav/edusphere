import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DAO } from '../../common/common.dao';
import { UserAccessToken, UserAccessTokenDocument } from './entities/user-access-token.entity';

@Injectable()
export class UserAccessTokenDAO extends DAO<UserAccessTokenDocument> {
  constructor(
    @InjectModel(UserAccessToken.name)
    readonly model: Model<UserAccessTokenDocument>,
  ) {
    super(model);
  }
}
