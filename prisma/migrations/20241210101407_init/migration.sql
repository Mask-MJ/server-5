/*
  Warnings:

  - You are about to drop the column `ValveStemSize` on the `Valve` table. All the data in the column will be lost.
  - You are about to drop the column `accessory` on the `Valve` table. All the data in the column will be lost.
  - You are about to drop the column `accessoryBrand` on the `Valve` table. All the data in the column will be lost.
  - You are about to drop the column `accessoryDescription` on the `Valve` table. All the data in the column will be lost.
  - You are about to drop the column `accessoryQuantity` on the `Valve` table. All the data in the column will be lost.
  - You are about to drop the column `accessoryType` on the `Valve` table. All the data in the column will be lost.
  - You are about to drop the column `actuatorType` on the `Valve` table. All the data in the column will be lost.
  - You are about to drop the column `instrumentBrand` on the `Valve` table. All the data in the column will be lost.
  - You are about to drop the column `instrumentDescription` on the `Valve` table. All the data in the column will be lost.
  - You are about to drop the column `instrumentType` on the `Valve` table. All the data in the column will be lost.
  - You are about to drop the column `positionerDescription` on the `Valve` table. All the data in the column will be lost.
  - You are about to drop the column `remark` on the `Valve` table. All the data in the column will be lost.
  - You are about to drop the column `tripValveQty` on the `Valve` table. All the data in the column will be lost.
  - You are about to drop the column `valveType` on the `Valve` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Valve" DROP COLUMN "ValveStemSize",
DROP COLUMN "accessory",
DROP COLUMN "accessoryBrand",
DROP COLUMN "accessoryDescription",
DROP COLUMN "accessoryQuantity",
DROP COLUMN "accessoryType",
DROP COLUMN "actuatorType",
DROP COLUMN "instrumentBrand",
DROP COLUMN "instrumentDescription",
DROP COLUMN "instrumentType",
DROP COLUMN "positionerDescription",
DROP COLUMN "remark",
DROP COLUMN "tripValveQty",
DROP COLUMN "valveType",
ADD COLUMN     "actuatorSeries" TEXT,
ADD COLUMN     "parts" TEXT,
ADD COLUMN     "valveRating" TEXT,
ADD COLUMN     "valveStemSize" TEXT;
