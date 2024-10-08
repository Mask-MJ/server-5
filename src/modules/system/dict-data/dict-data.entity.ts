import { DictData } from '@prisma/client';
export class DictDataEntity implements DictData {
  id: number;
  name: string;
  value: string;
  sort: number;
  status: boolean;
  type: string;
  cnTitle: string | null;
  enTitle: string | null;
  dictTypeId: number;
  treeId: number | null;
  createBy: string;
  updateBy: string | null;
  remark: string | null;
  createdAt: Date;
  updatedAt: Date;
}
