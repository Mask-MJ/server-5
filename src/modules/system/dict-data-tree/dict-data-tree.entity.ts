import { DictDataTree } from '@prisma/client';

export class DictDataTreeEntity implements DictDataTree {
  id: number;
  name: string;
  value: string;
  remark: string;
  parentId: number | null;
}
