/*
  Warnings:

  - You are about to drop the `ValveDataHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ValveDataHistory" DROP CONSTRAINT "ValveDataHistory_valveId_fkey";

-- DropTable
DROP TABLE "ValveDataHistory";

-- CreateTable
CREATE TABLE "ValveHistoryDataList" (
    "id" SERIAL NOT NULL,
    "tag" TEXT NOT NULL,
    "valveId" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ValveHistoryDataList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValveHistoryData" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT,
    "valveHistoryDataListId" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "valveId" INTEGER,

    CONSTRAINT "ValveHistoryData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ValveHistoryDataList" ADD CONSTRAINT "ValveHistoryDataList_valveId_fkey" FOREIGN KEY ("valveId") REFERENCES "Valve"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValveHistoryData" ADD CONSTRAINT "ValveHistoryData_valveHistoryDataListId_fkey" FOREIGN KEY ("valveHistoryDataListId") REFERENCES "ValveHistoryDataList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValveHistoryData" ADD CONSTRAINT "ValveHistoryData_valveId_fkey" FOREIGN KEY ("valveId") REFERENCES "Valve"("id") ON DELETE SET NULL ON UPDATE CASCADE;
