/*
  Warnings:

  - You are about to drop the column `valveId` on the `ValveHistoryData` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ValveHistoryData" DROP CONSTRAINT "ValveHistoryData_valveId_fkey";

-- AlterTable
ALTER TABLE "ValveHistoryData" DROP COLUMN "valveId";
