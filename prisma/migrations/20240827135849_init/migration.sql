-- AlterTable
ALTER TABLE "public"."ValveData" ADD COLUMN     "type" TEXT NOT NULL DEFAULT '0';

-- AlterTable
ALTER TABLE "public"."ValveHistoryData" ADD COLUMN     "type" TEXT NOT NULL DEFAULT '0';
