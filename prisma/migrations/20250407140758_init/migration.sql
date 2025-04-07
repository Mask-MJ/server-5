/*
  Warnings:

  - You are about to drop the column `endUser` on the `WorkOrder` table. All the data in the column will be lost.
  - You are about to drop the column `valves` on the `WorkOrder` table. All the data in the column will be lost.
  - You are about to drop the column `workSheet` on the `WorkOrder` table. All the data in the column will be lost.
  - Added the required column `factoryId` to the `WorkOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `faultCategory` to the `WorkOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `possibleCauseAnalysis` to the `WorkOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recommendation` to the `WorkOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remedialActions` to the `WorkOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taskDescription` to the `WorkOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valveId` to the `WorkOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."WorkOrder" DROP COLUMN "endUser",
DROP COLUMN "valves",
DROP COLUMN "workSheet",
ADD COLUMN     "factoryId" INTEGER NOT NULL,
ADD COLUMN     "faultCategory" TEXT NOT NULL,
ADD COLUMN     "possibleCauseAnalysis" TEXT NOT NULL,
ADD COLUMN     "recommendation" TEXT NOT NULL,
ADD COLUMN     "remedialActions" TEXT NOT NULL,
ADD COLUMN     "taskDescription" TEXT NOT NULL,
ADD COLUMN     "valveId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."_ValveToWorkOrder" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ValveToWorkOrder_AB_unique" ON "public"."_ValveToWorkOrder"("A", "B");

-- CreateIndex
CREATE INDEX "_ValveToWorkOrder_B_index" ON "public"."_ValveToWorkOrder"("B");

-- AddForeignKey
ALTER TABLE "public"."WorkOrder" ADD CONSTRAINT "WorkOrder_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "public"."Factory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ValveToWorkOrder" ADD CONSTRAINT "_ValveToWorkOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Valve"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ValveToWorkOrder" ADD CONSTRAINT "_ValveToWorkOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."WorkOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
