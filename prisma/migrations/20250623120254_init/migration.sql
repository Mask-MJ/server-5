/*
  Warnings:

  - You are about to drop the column `actuatorActionForm` on the `Valve` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Valve" DROP COLUMN "actuatorActionForm",
ADD COLUMN     "failurePosition" TEXT;
