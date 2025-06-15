/*
  Warnings:

  - You are about to drop the column `analysisTaskId` on the `Valve` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Valve" DROP CONSTRAINT "Valve_analysisTaskId_fkey";

-- AlterTable
ALTER TABLE "public"."Valve" DROP COLUMN "analysisTaskId";

-- CreateTable
CREATE TABLE "public"."_AnalysisTaskToValve" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AnalysisTaskToValve_AB_unique" ON "public"."_AnalysisTaskToValve"("A", "B");

-- CreateIndex
CREATE INDEX "_AnalysisTaskToValve_B_index" ON "public"."_AnalysisTaskToValve"("B");

-- AddForeignKey
ALTER TABLE "public"."_AnalysisTaskToValve" ADD CONSTRAINT "_AnalysisTaskToValve_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."AnalysisTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AnalysisTaskToValve" ADD CONSTRAINT "_AnalysisTaskToValve_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Valve"("id") ON DELETE CASCADE ON UPDATE CASCADE;
