import { AnalysisTask } from '@prisma/client';

export class AnalysisTaskEntity implements AnalysisTask {
  id: number;
  name: string;
  status: number;
  remark: string;
  dictTypeId: number;
  factoryId: number;
  createBy: string;
  updateBy: string;
  createdAt: Date;
  updatedAt: Date;
}
