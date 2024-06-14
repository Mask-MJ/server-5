/*
  Warnings:

  - You are about to drop the column `actuator` on the `Valve` table. All the data in the column will be lost.
  - You are about to drop the column `brand` on the `Valve` table. All the data in the column will be lost.
  - You are about to drop the column `caliber` on the `Valve` table. All the data in the column will be lost.
  - You are about to drop the column `fault` on the `Valve` table. All the data in the column will be lost.
  - You are about to drop the column `leak` on the `Valve` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `Valve` table. All the data in the column will be lost.
  - You are about to drop the column `locator` on the `Valve` table. All the data in the column will be lost.
  - You are about to drop the column `material` on the `Valve` table. All the data in the column will be lost.
  - You are about to drop the column `model` on the `Valve` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Valve` table. All the data in the column will be lost.
  - You are about to drop the column `serial` on the `Valve` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Valve` table. All the data in the column will be lost.
  - Added the required column `tag` to the `Valve` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valveId` to the `ValveData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Valve" DROP COLUMN "actuator",
DROP COLUMN "brand",
DROP COLUMN "caliber",
DROP COLUMN "fault",
DROP COLUMN "leak",
DROP COLUMN "level",
DROP COLUMN "locator",
DROP COLUMN "material",
DROP COLUMN "model",
DROP COLUMN "name",
DROP COLUMN "serial",
DROP COLUMN "status",
ADD COLUMN     "accessory" TEXT,
ADD COLUMN     "accessoryBrand" TEXT,
ADD COLUMN     "accessoryDescription" TEXT,
ADD COLUMN     "accessoryQuantity" TEXT,
ADD COLUMN     "accessoryType" TEXT,
ADD COLUMN     "actuatorBrand" TEXT,
ADD COLUMN     "actuatorDescription" TEXT,
ADD COLUMN     "actuatorSize" TEXT,
ADD COLUMN     "actuatorType" TEXT,
ADD COLUMN     "criticalApplication" TEXT,
ADD COLUMN     "fluidName" TEXT,
ADD COLUMN     "handwheel" TEXT,
ADD COLUMN     "instrumentBrand" TEXT,
ADD COLUMN     "instrumentDescription" TEXT,
ADD COLUMN     "instrumentType" TEXT,
ADD COLUMN     "positionerBrand" TEXT,
ADD COLUMN     "positionerDescription" TEXT,
ADD COLUMN     "positionerType" TEXT,
ADD COLUMN     "serialNumber" TEXT,
ADD COLUMN     "since" TIMESTAMP(3),
ADD COLUMN     "tag" TEXT NOT NULL,
ADD COLUMN     "unit" TEXT,
ADD COLUMN     "valveBodyMaterial" TEXT,
ADD COLUMN     "valveBonnet" TEXT,
ADD COLUMN     "valveBrand" TEXT,
ADD COLUMN     "valveDescription" TEXT,
ADD COLUMN     "valveEndConnection" TEXT,
ADD COLUMN     "valveSeatLeakage" TEXT,
ADD COLUMN     "valveSize" TEXT,
ADD COLUMN     "valveTrim" TEXT,
ADD COLUMN     "valveType" TEXT;

-- AlterTable
ALTER TABLE "ValveData" ADD COLUMN     "valveId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ValveData" ADD CONSTRAINT "ValveData_valveId_fkey" FOREIGN KEY ("valveId") REFERENCES "Valve"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
