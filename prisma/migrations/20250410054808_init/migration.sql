-- AlterTable
ALTER TABLE "public"."Valve" ADD COLUMN     "lsDescription" TEXT,
ADD COLUMN     "pilotDescription" TEXT,
ADD COLUMN     "positionerDescription" TEXT,
ADD COLUMN     "qeDescription" TEXT,
ADD COLUMN     "regulatorDescription" TEXT,
ADD COLUMN     "signalComparatorDescription" TEXT,
ADD COLUMN     "sovDescription" TEXT,
ADD COLUMN     "tripValveDescription" TEXT,
ADD COLUMN     "vbDescription" TEXT;

-- CreateTable
CREATE TABLE "public"."WorkOrder" (
    "id" SERIAL NOT NULL,
    "typeName" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "serial" TEXT NOT NULL,
    "attachment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "remark" TEXT NOT NULL DEFAULT '',
    "serviceAppId" TEXT NOT NULL,
    "factoryId" INTEGER NOT NULL,
    "faultCategory" TEXT NOT NULL,
    "possibleCauseAnalysis" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "remedialActions" TEXT NOT NULL,
    "taskDescription" TEXT NOT NULL,

    CONSTRAINT "WorkOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_ValveToWorkOrder" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkOrder_serial_key" ON "public"."WorkOrder"("serial");

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
