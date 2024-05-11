/*
  Warnings:

  - You are about to drop the column `method` on the `OperationLog` table. All the data in the column will be lost.
  - Added the required column `module` to the `OperationLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OperationLog" DROP COLUMN "method",
ADD COLUMN     "module" TEXT NOT NULL;
