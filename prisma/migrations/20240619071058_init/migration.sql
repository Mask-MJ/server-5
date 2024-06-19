-- CreateTable
CREATE TABLE "ValveDataHistory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT,
    "valveId" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ValveDataHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ValveDataHistory" ADD CONSTRAINT "ValveDataHistory_valveId_fkey" FOREIGN KEY ("valveId") REFERENCES "Valve"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
