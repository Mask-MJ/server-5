/*
  Warnings:

  - Added the required column `userId` to the `LoginLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LoginLog" ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "sessionId" SET DEFAULT '';
