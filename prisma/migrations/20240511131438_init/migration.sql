/*
  Warnings:

  - You are about to drop the column `roleId` on the `Dept` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Dept" DROP CONSTRAINT "Dept_roleId_fkey";

-- AlterTable
ALTER TABLE "Dept" DROP COLUMN "roleId",
ALTER COLUMN "leader" SET DEFAULT '',
ALTER COLUMN "phone" SET DEFAULT '',
ALTER COLUMN "email" SET DEFAULT '';
