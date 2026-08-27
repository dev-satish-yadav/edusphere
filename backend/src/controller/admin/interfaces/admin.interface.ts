import { AdminDocument } from '../entities/admin.entity';

export interface ILoginAdminData {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

export type IAdminData = AdminDocument;
