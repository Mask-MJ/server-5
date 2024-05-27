import { Factory } from '@prisma/client';

export class FactoryEntity implements Factory {
  id: number;
  name: string;
  status: boolean;
  address: string;
  longitude: string;
  latitude: string;
  parentId: number | null;
  remark: string;
  createBy: string;
  updateBy: string;
  createdAt: Date;
  updatedAt: Date;
}
