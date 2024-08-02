-- DropForeignKey
ALTER TABLE "DictData" DROP CONSTRAINT "DictData_dictTypeId_fkey";

-- AddForeignKey
ALTER TABLE "DictData" ADD CONSTRAINT "DictData_dictTypeId_fkey" FOREIGN KEY ("dictTypeId") REFERENCES "DictType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
