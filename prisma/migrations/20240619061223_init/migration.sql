/*
  Warnings:

  - Added the required column `time` to the `ValveData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ValveData" ADD COLUMN     "time" TIMESTAMP(3) NOT NULL;
