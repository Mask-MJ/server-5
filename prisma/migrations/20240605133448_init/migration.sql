-- DropForeignKey
ALTER TABLE "Pdf" DROP CONSTRAINT "Pdf_taskId_fkey";

-- AddForeignKey
ALTER TABLE "Pdf" ADD CONSTRAINT "Pdf_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "AnalysisTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
