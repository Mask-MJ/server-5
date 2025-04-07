/*
  Warnings:

  - Added the required column `serviceAppId` to the `WorkOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."WorkOrder" ADD COLUMN     "serviceAppId" TEXT NOT NULL;
