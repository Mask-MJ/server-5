-- CreateTable
CREATE TABLE "public"."ServiceAppPushLog" (
    "id" SERIAL NOT NULL,
    "serviceAppId" TEXT,
    "serial" TEXT,
    "endUserName" TEXT,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "errorMessage" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceAppPushLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ServiceAppPushLog_serviceAppId_idx" ON "public"."ServiceAppPushLog"("serviceAppId");

-- CreateIndex
CREATE INDEX "ServiceAppPushLog_serial_idx" ON "public"."ServiceAppPushLog"("serial");

-- CreateIndex
CREATE INDEX "ServiceAppPushLog_endUserName_idx" ON "public"."ServiceAppPushLog"("endUserName");

-- CreateIndex
CREATE INDEX "ServiceAppPushLog_receivedAt_idx" ON "public"."ServiceAppPushLog"("receivedAt");
