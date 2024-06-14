-- CreateTable
CREATE TABLE "ValveData" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT NOT NULL,

    CONSTRAINT "ValveData_pkey" PRIMARY KEY ("id")
);
