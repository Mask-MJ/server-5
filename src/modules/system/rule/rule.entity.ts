import { Rule } from '@prisma/client';

export class RuleEntity implements Rule {
  id: number;
  name: string;
  url: string;
  fileName: string;
  remark: string;
  createdAt: Date;
  updatedAt: Date;
}
