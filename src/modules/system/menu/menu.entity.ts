import { Menu } from '@prisma/client';
export class MenuEntity implements Menu {
  id: number;
  name: string;
  path: string;
  icon: string;
  hidden: boolean;
  status: boolean;
  sort: number;
  parentId: number | null;
  remark: string;
  createBy: string;
  updateBy: string;
  createdAt: Date;
  updatedAt: Date;
}
