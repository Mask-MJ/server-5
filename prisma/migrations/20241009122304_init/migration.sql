/*
  Warnings:

  - You are about to drop the column `cnTitle` on the `DictDataTree` table. All the data in the column will be lost.
  - You are about to drop the column `enTitle` on the `DictDataTree` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."DictData" ADD COLUMN     "cnTitle" TEXT,
ADD COLUMN     "enTitle" TEXT;

-- AlterTable
ALTER TABLE "public"."DictDataTree" DROP COLUMN "cnTitle",
DROP COLUMN "enTitle";
