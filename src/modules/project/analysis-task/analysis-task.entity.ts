import { AnalysisTask, AnalysisTaskResult, Prisma } from '@prisma/client';

export class AnalysisTaskEntity implements AnalysisTask {
  id: number;
  name: string;
  status: number;
  remark: string;
  dictTypeId: number;
  factoryId: number;
  ruleId: number;
  createBy: string;
  updateBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export class AnalysisTaskResultEntity implements AnalysisTaskResult {
  id: number;
  analysisTaskId: number;
  tag: string;
  time: Date;
  data: Prisma.JsonArray;
}
