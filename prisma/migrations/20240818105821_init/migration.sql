-- DropForeignKey
ALTER TABLE "public"."AnalysisTask" DROP CONSTRAINT "AnalysisTask_dictTypeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnalysisTask" DROP CONSTRAINT "AnalysisTask_factoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Factory" DROP CONSTRAINT "Factory_parentId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Factory" ADD CONSTRAINT "Factory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Factory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnalysisTask" ADD CONSTRAINT "AnalysisTask_dictTypeId_fkey" FOREIGN KEY ("dictTypeId") REFERENCES "public"."DictType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnalysisTask" ADD CONSTRAINT "AnalysisTask_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "public"."Factory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
