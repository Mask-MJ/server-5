-- DropForeignKey
ALTER TABLE "public"."AnalysisTask" DROP CONSTRAINT "AnalysisTask_dictTypeId_fkey";

-- AddForeignKey
ALTER TABLE "public"."AnalysisTask" ADD CONSTRAINT "AnalysisTask_dictTypeId_fkey" FOREIGN KEY ("dictTypeId") REFERENCES "public"."DictType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
