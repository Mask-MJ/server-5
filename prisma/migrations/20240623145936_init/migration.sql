/*
  Warnings:

  - Added the required column `tag` to the `AnalysisTaskResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `AnalysisTaskResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AnalysisTaskResult" ADD COLUMN     "data" JSONB,
ADD COLUMN     "tag" TEXT NOT NULL,
ADD COLUMN     "time" TIMESTAMP(3) NOT NULL;
