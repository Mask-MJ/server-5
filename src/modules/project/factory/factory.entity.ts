import { Factory } from '@prisma/client';

export class FactoryEntity implements Factory {
  id: number;
  name: string;
  status: boolean;
  address: string;
  location: number[];
  remark: string;
  parentId: number | null;
  createBy: string;
  updateBy: string;
  role: number[];
  device: number[];
  contract: number[];
  valve: number[];
  createdAt: Date;
  updatedAt: Date;
}
