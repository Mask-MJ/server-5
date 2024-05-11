import { OperationLog } from '@prisma/client';

export class OperationLogEntity implements OperationLog {
  id: number;
  title: string;
  businessType: number;
  module: string;
  account: string;
  ip: string;
  address: string;
  createdAt: Date;
}
