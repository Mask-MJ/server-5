/*
  Warnings:

  - You are about to drop the column `status` on the `Dept` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `DictType` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `OperationLog` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Role` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Dept" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "DictType" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "OperationLog" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "status";
