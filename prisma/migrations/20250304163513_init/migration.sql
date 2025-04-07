-- DropForeignKey
ALTER TABLE "public"."Valve" DROP CONSTRAINT "Valve_analysisTaskId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Valve" ADD CONSTRAINT "Valve_analysisTaskId_fkey" FOREIGN KEY ("analysisTaskId") REFERENCES "public"."AnalysisTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
