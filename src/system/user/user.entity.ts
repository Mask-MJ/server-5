import { User } from '@prisma/client';

export class UserEntity implements User {
  id: number;
  account: string;
  password: string;
  nickname: string;
  avatar: string;
  email: string;
  phoneNumber: string;
  sex: number;
  status: boolean;
  createBy: string;
  createdAt: Date;
  updatedAt: Date;
  remark: string;
}
