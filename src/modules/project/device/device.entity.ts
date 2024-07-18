import { Device } from '@prisma/client';
import { FactoryEntity } from 'src/modules/project/factory/factory.entity';

export class DeviceEntity implements Device {
  id: number;
  name: string;
  status: boolean;
  remark: string;
  factoryId: number;
  factory: FactoryEntity;
  createBy: string;
  updateBy: string;
  createdAt: Date;
  updatedAt: Date;
}
