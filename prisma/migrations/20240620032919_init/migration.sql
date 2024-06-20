/*
  Warnings:

  - You are about to drop the column `parentId` on the `DictData` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "DictData" DROP CONSTRAINT "DictData_parentId_fkey";

-- AlterTable
ALTER TABLE "DictData" DROP COLUMN "parentId",
ADD COLUMN     "treeId" INTEGER;

-- CreateTable
CREATE TABLE "DictDataTree" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "remark" TEXT,
    "parentId" INTEGER,

    CONSTRAINT "DictDataTree_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DictData" ADD CONSTRAINT "DictData_treeId_fkey" FOREIGN KEY ("treeId") REFERENCES "DictDataTree"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DictDataTree" ADD CONSTRAINT "DictDataTree_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "DictDataTree"("id") ON DELETE SET NULL ON UPDATE CASCADE;
