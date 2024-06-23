-- CreateTable
CREATE TABLE "AnalysisTaskResult" (
    "id" SERIAL NOT NULL,
    "analysisTaskId" INTEGER NOT NULL,

    CONSTRAINT "AnalysisTaskResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnalysisTaskResult_analysisTaskId_key" ON "AnalysisTaskResult"("analysisTaskId");

-- AddForeignKey
ALTER TABLE "AnalysisTaskResult" ADD CONSTRAINT "AnalysisTaskResult_analysisTaskId_fkey" FOREIGN KEY ("analysisTaskId") REFERENCES "AnalysisTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
