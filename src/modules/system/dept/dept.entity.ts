import { Dept } from '@prisma/client';
export class DeptEntity implements Dept {
  id: number;
  name: string;
  sort: number;
  leader: string;
  phone: string;
  email: string;
  parentId: number | null;
  remark: string | null;
  children: DeptEntity[];
  createBy: string;
  updateBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}
