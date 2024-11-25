-- DropForeignKey
ALTER TABLE "public"."AnalysisTask" DROP CONSTRAINT "AnalysisTask_factoryId_fkey";

-- AddForeignKey
ALTER TABLE "public"."AnalysisTask" ADD CONSTRAINT "AnalysisTask_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "public"."Factory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
