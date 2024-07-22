-- DropForeignKey
ALTER TABLE "AnalysisTaskResult" DROP CONSTRAINT "AnalysisTaskResult_analysisTaskId_fkey";

-- AddForeignKey
ALTER TABLE "AnalysisTaskResult" ADD CONSTRAINT "AnalysisTaskResult_analysisTaskId_fkey" FOREIGN KEY ("analysisTaskId") REFERENCES "AnalysisTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
