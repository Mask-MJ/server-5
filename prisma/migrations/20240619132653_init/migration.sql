-- AlterTable
ALTER TABLE "DictData" ADD COLUMN     "parentId" INTEGER;

-- AddForeignKey
ALTER TABLE "DictData" ADD CONSTRAINT "DictData_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "DictData"("id") ON DELETE SET NULL ON UPDATE CASCADE;
