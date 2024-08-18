-- DropForeignKey
ALTER TABLE "public"."Contract" DROP CONSTRAINT "Contract_factoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Device" DROP CONSTRAINT "Device_factoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DictData" DROP CONSTRAINT "DictData_treeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DictDataTree" DROP CONSTRAINT "DictDataTree_parentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ValveData" DROP CONSTRAINT "ValveData_valveId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ValveHistoryData" DROP CONSTRAINT "ValveHistoryData_valveHistoryDataListId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ValveHistoryDataList" DROP CONSTRAINT "ValveHistoryDataList_valveId_fkey";

-- AddForeignKey
ALTER TABLE "public"."DictData" ADD CONSTRAINT "DictData_treeId_fkey" FOREIGN KEY ("treeId") REFERENCES "public"."DictDataTree"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DictDataTree" ADD CONSTRAINT "DictDataTree_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."DictDataTree"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contract" ADD CONSTRAINT "Contract_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "public"."Factory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Device" ADD CONSTRAINT "Device_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "public"."Factory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ValveData" ADD CONSTRAINT "ValveData_valveId_fkey" FOREIGN KEY ("valveId") REFERENCES "public"."Valve"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ValveHistoryDataList" ADD CONSTRAINT "ValveHistoryDataList_valveId_fkey" FOREIGN KEY ("valveId") REFERENCES "public"."Valve"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ValveHistoryData" ADD CONSTRAINT "ValveHistoryData_valveHistoryDataListId_fkey" FOREIGN KEY ("valveHistoryDataListId") REFERENCES "public"."ValveHistoryDataList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
