-- DropForeignKey
ALTER TABLE "public"."Valve" DROP CONSTRAINT "Valve_analysisTaskId_fkey";

-- CreateTable
CREATE TABLE "public"."WorkOrder" (
    "id" SERIAL NOT NULL,
    "typeName" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "serial" TEXT NOT NULL,
    "attachment" TEXT NOT NULL,
    "endUser" TEXT NOT NULL,
    "valves" TEXT NOT NULL,
    "workSheet" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "remark" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "WorkOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkOrder_serial_key" ON "public"."WorkOrder"("serial");

-- AddForeignKey
ALTER TABLE "public"."Valve" ADD CONSTRAINT "Valve_analysisTaskId_fkey" FOREIGN KEY ("analysisTaskId") REFERENCES "public"."AnalysisTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
