/*
  Warnings:

  - You are about to drop the column `positionerType` on the `Valve` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."DictDataTree" ADD COLUMN     "cnTitle" TEXT,
ADD COLUMN     "enTitle" TEXT;

-- AlterTable
ALTER TABLE "public"."Valve" DROP COLUMN "positionerType",
ADD COLUMN     "ValveStemSize" TEXT,
ADD COLUMN     "lsBrand" TEXT,
ADD COLUMN     "lsModel" TEXT,
ADD COLUMN     "lsQty" INTEGER,
ADD COLUMN     "no" TEXT,
ADD COLUMN     "pilotBrand" TEXT,
ADD COLUMN     "pilotModel" TEXT,
ADD COLUMN     "pilotQty" INTEGER,
ADD COLUMN     "positionerModel" TEXT,
ADD COLUMN     "qeBrand" TEXT,
ADD COLUMN     "qeModel" TEXT,
ADD COLUMN     "qeQty" INTEGER,
ADD COLUMN     "regulatorBrand" TEXT,
ADD COLUMN     "regulatorModel" TEXT,
ADD COLUMN     "signalComparatorBrand" TEXT,
ADD COLUMN     "signalComparatorModel" TEXT,
ADD COLUMN     "sovBrand" TEXT,
ADD COLUMN     "sovModel" TEXT,
ADD COLUMN     "sovQty" INTEGER,
ADD COLUMN     "stroke" TEXT,
ADD COLUMN     "tripValveBrand" TEXT,
ADD COLUMN     "tripValveModel" TEXT,
ADD COLUMN     "tripValveQty" INTEGER,
ADD COLUMN     "vbBrand" TEXT,
ADD COLUMN     "vbModel" TEXT,
ADD COLUMN     "vbQty" INTEGER;
