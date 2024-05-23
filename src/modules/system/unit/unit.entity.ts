import { Unit } from '@prisma/client';

export class UnitEntity implements Unit {
  id: number;
  name: string;
  value: string;
  remark: string;
  createdAt: Date;
  updatedAt: Date;
}
