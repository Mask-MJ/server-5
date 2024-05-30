/*
  Warnings:

  - You are about to drop the column `pdfPath` on the `AnalysisTask` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AnalysisTask" DROP COLUMN "pdfPath";

-- CreateTable
CREATE TABLE "Pdf" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "taskId" INTEGER NOT NULL,
    "createBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pdf_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pdf" ADD CONSTRAINT "Pdf_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "AnalysisTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
