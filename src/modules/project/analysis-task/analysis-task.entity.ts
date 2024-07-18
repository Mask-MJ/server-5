import { AnalysisTask, AnalysisTaskResult, Prisma } from '@prisma/client';
import { DictTypeEntity } from 'src/modules/system/dict-type/dict-type.entity';
import { FactoryEntity } from 'src/modules/project/factory/factory.entity';
export class AnalysisTaskEntity implements AnalysisTask {
  id: number;
  name: string;
  status: number;
  remark: string;
  dictTypeId: number;
  dict: DictTypeEntity;
  factoryId: number;
  factory: FactoryEntity;
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
