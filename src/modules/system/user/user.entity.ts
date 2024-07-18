import { ApiHideProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { RoleEntity } from '../role/role.entity';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
  id: number;
  isAdmin: boolean;
  account: string;
  @ApiHideProperty()
  password: string;
  nickname: string;
  avatar: string;
  email: string;
  phoneNumber: string;
  role: RoleEntity[];
  sex: number;
  status: boolean;
  createBy: string;
  createdAt: Date;
  updatedAt: Date;
  remark: string;
}
