/*
  Warnings:

  - You are about to drop the column `failurePosition` on the `Valve` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Valve" DROP COLUMN "failurePosition",
ADD COLUMN     "actuatorFailurePosition" TEXT;
