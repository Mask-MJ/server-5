-- AlterTable
ALTER TABLE "Valve" ADD COLUMN     "analysisTaskId" INTEGER;

-- AddForeignKey
ALTER TABLE "Valve" ADD CONSTRAINT "Valve_analysisTaskId_fkey" FOREIGN KEY ("analysisTaskId") REFERENCES "AnalysisTask"("id") ON DELETE SET NULL ON UPDATE CASCADE;
