-- CreateTable
CREATE TABLE "AnalysisTaskStatus" (
    "id" SERIAL NOT NULL,
    "status" INTEGER NOT NULL,
    "analysisTaskId" INTEGER NOT NULL,

    CONSTRAINT "AnalysisTaskStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FarseAction" (
    "id" SERIAL NOT NULL,
    "tageNumber" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "parseResult" JSON,
    "remark" TEXT,
    "createdAt" TIMESTAMPTZ(6),
    "updatedAt" TIMESTAMPTZ(6),
    "factoryId" INTEGER NOT NULL,
    "analysisTaskId" INTEGER NOT NULL,

    CONSTRAINT "FarseAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FarseValue" (
    "id" SERIAL NOT NULL,
    "tageNumber" TEXT NOT NULL,
    "checkTime" DATE NOT NULL,
    "parseValue" TEXT,
    "parseUnit" TEXT,
    "remark" TEXT,
    "createdAt" TIMESTAMPTZ(6),
    "updatedAt" TIMESTAMPTZ(6),
    "keywordId" INTEGER NOT NULL,
    "unitId" INTEGER,
    "factoryId" INTEGER NOT NULL,
    "analysisTaskId" INTEGER NOT NULL,

    CONSTRAINT "FarseValue_pkey" PRIMARY KEY ("id")
);
