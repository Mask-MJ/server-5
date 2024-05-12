import { Device } from '@prisma/client';

export class DeviceEntity implements Device {
  id: number;
  name: string;
  status: boolean;
  remark: string;
  factoryId: number;
  createBy: string;
  updateBy: string;
  createdAt: Date;
  updatedAt: Date;
}
