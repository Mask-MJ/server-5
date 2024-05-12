import { Contract } from '@prisma/client';
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
  createBy: string;
  updateBy: string;
  createdAt: Date;
  updatedAt: Date;
}
