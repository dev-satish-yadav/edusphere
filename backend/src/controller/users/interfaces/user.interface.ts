import { UserDocument } from '../entities/user.entity';

export interface ILoginUserData {
  user: {
    _id: string;
    name: string;
    email: string;
  };
  token: string;
}

export type IUserData = UserDocument;
