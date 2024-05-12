/*
  Warnings:

  - You are about to drop the column `dictTypeValue` on the `DictData` table. All the data in the column will be lost.
  - Added the required column `dictTypeId` to the `DictData` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DictData" DROP CONSTRAINT "DictData_dictTypeValue_fkey";

-- DropIndex
DROP INDEX "DictType_value_key";

-- AlterTable
ALTER TABLE "DictData" DROP COLUMN "dictTypeValue",
ADD COLUMN     "dictTypeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "DictData" ADD CONSTRAINT "DictData_dictTypeId_fkey" FOREIGN KEY ("dictTypeId") REFERENCES "DictType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
