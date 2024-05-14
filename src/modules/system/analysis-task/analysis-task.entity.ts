import { AnalysisTask } from '@prisma/client';

export class AnalysisTaskEntity implements AnalysisTask {
  id: number;
  name: string;
  status: number;
  pdfPath: string[];
  remark: string;
  dictId: number;
  factoryId: number;
  createBy: string;
  updateBy: string;
  createdAt: Date;
  updatedAt: Date;
}
