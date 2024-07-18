import { Contract } from '@prisma/client';
import { FactoryEntity } from 'src/modules/project/factory/factory.entity';
export class ContractEntity implements Contract {
  id: number;
  name: string;
  contractTime: Date;
  valveCount: number;
  highValveCount: number;
  customer: string;
  customerPhone: string;
  saler: string;
  remark: string;
  factoryId: number;
  factory: FactoryEntity;
  createBy: string;
  updateBy: string;
  createdAt: Date;
  updatedAt: Date;
}
