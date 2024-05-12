import { DictData } from '@prisma/client';
export class DictDataEntity implements DictData {
  id: number;
  name: string;
  value: string;
  sort: number;
  status: boolean;
  dictTypeId: number;
  createBy: string;
  updateBy: string | null;
  remark: string | null;
  createdAt: Date;
  updatedAt: Date;
}
