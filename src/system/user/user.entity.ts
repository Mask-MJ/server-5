import { ApiHideProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
  id: number;
  account: string;
  @ApiHideProperty()
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
