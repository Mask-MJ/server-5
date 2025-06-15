-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "flask_ocrt";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."AnalysisTask" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "remark" TEXT NOT NULL DEFAULT '',
    "dictTypeId" INTEGER NOT NULL,
    "factoryId" INTEGER NOT NULL,
    "ruleId" INTEGER NOT NULL DEFAULT 1,
    "createBy" TEXT NOT NULL,
    "updateBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnalysisTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnalysisTaskResult" (
    "id" SERIAL NOT NULL,
    "analysisTaskId" INTEGER NOT NULL,
    "tag" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "data" JSONB,

    CONSTRAINT "AnalysisTaskResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Rule" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "remark" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pdf" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "taskId" INTEGER NOT NULL,
    "createBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Pdf_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Unit" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Dept" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 1,
    "leader" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "createBy" TEXT NOT NULL,
    "updateBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parentId" INTEGER,

    CONSTRAINT "Dept_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DictType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createBy" TEXT NOT NULL,
    "updateBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "remark" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "DictType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DictData" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 1,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createBy" TEXT NOT NULL,
    "updateBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "remark" TEXT NOT NULL DEFAULT '',
    "dictTypeId" INTEGER NOT NULL,
    "treeId" INTEGER,
    "type" TEXT NOT NULL DEFAULT '0',
    "cnTitle" TEXT,
    "enTitle" TEXT,
    "chartType" TEXT DEFAULT '0',
    "isChart" BOOLEAN DEFAULT false,
    "lowerLimit" TEXT,
    "upperLimit" TEXT,

    CONSTRAINT "DictData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DictDataTree" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "remark" TEXT,
    "parentId" INTEGER,

    CONSTRAINT "DictDataTree_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "public"."Factory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "address" TEXT DEFAULT '',
    "longitude" TEXT DEFAULT '',
    "latitude" TEXT DEFAULT '',
    "remark" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createBy" TEXT NOT NULL,
    "updateBy" TEXT,
    "parentId" INTEGER,
    "city" TEXT DEFAULT '',
    "county" TEXT DEFAULT '',
    "province" TEXT DEFAULT '',
    "code" TEXT DEFAULT '',
    "industry" TEXT DEFAULT '',

    CONSTRAINT "Factory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contract" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "contractTime" TIMESTAMP(3) NOT NULL,
    "valveCount" INTEGER NOT NULL,
    "highValveCount" INTEGER DEFAULT 0,
    "customer" TEXT NOT NULL DEFAULT '',
    "customerPhone" TEXT NOT NULL DEFAULT '',
    "saler" TEXT NOT NULL DEFAULT '',
    "remark" TEXT NOT NULL DEFAULT '',
    "factoryId" INTEGER NOT NULL,
    "createBy" TEXT NOT NULL,
    "updateBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Device" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "remark" TEXT NOT NULL DEFAULT '',
    "factoryId" INTEGER NOT NULL,
    "createBy" TEXT NOT NULL,
    "updateBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OperationLog" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "businessType" INTEGER NOT NULL DEFAULT 1,
    "module" TEXT NOT NULL,
    "account" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "OperationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LoginLog" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT NOT NULL DEFAULT '',
    "account" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "LoginLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Menu" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 1,
    "path" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT '',
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createBy" TEXT NOT NULL,
    "updateBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "remark" TEXT NOT NULL DEFAULT '',
    "parentId" INTEGER,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Permission" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "remark" TEXT NOT NULL DEFAULT '',
    "menuId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Post" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 1,
    "createBy" TEXT NOT NULL,
    "updateBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "remark" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "account" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nickname" TEXT NOT NULL DEFAULT '',
    "avatar" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "phoneNumber" TEXT NOT NULL DEFAULT '',
    "sex" INTEGER NOT NULL DEFAULT 1,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "remark" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 1,
    "createBy" TEXT NOT NULL,
    "updateBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "remark" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Valve" (
    "id" SERIAL NOT NULL,
    "tag" TEXT NOT NULL,
    "unit" TEXT,
    "fluidName" TEXT,
    "criticalApplication" TEXT,
    "serialNumber" TEXT,
    "since" TIMESTAMP(3),
    "valveBrand" TEXT,
    "valveSize" TEXT,
    "valveEndConnection" TEXT,
    "valveBodyMaterial" TEXT,
    "valveBonnet" TEXT,
    "valveTrim" TEXT,
    "valveSeatLeakage" TEXT,
    "valveDescription" TEXT,
    "actuatorBrand" TEXT,
    "actuatorSize" TEXT,
    "handwheel" TEXT,
    "actuatorDescription" TEXT,
    "positionerBrand" TEXT,
    "factoryId" INTEGER NOT NULL,
    "deviceId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createBy" TEXT NOT NULL DEFAULT '',
    "updateBy" TEXT,
    "valveSeries" TEXT,
    "source" TEXT,
    "lsBrand" TEXT,
    "lsModel" TEXT,
    "lsQty" INTEGER,
    "no" TEXT,
    "pilotBrand" TEXT,
    "pilotModel" TEXT,
    "pilotQty" INTEGER,
    "positionerModel" TEXT,
    "qeBrand" TEXT,
    "qeModel" TEXT,
    "qeQty" INTEGER,
    "regulatorBrand" TEXT,
    "regulatorModel" TEXT,
    "signalComparatorBrand" TEXT,
    "signalComparatorModel" TEXT,
    "sovBrand" TEXT,
    "sovModel" TEXT,
    "sovQty" INTEGER,
    "stroke" TEXT,
    "tripValveBrand" TEXT,
    "tripValveModel" TEXT,
    "vbBrand" TEXT,
    "vbModel" TEXT,
    "vbQty" INTEGER,
    "actuatorSeries" TEXT,
    "parts" TEXT,
    "valveRating" TEXT,
    "valveStemSize" TEXT,
    "actuatorActionForm" TEXT,
    "valveCv" TEXT,
    "lsDescription" TEXT,
    "pilotDescription" TEXT,
    "positionerDescription" TEXT,
    "qeDescription" TEXT,
    "regulatorDescription" TEXT,
    "signalComparatorDescription" TEXT,
    "sovDescription" TEXT,
    "tripValveDescription" TEXT,
    "vbDescription" TEXT,

    CONSTRAINT "Valve_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ValveData" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT,
    "valveId" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL DEFAULT '0',
    "treeId" INTEGER,

    CONSTRAINT "ValveData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ValveHistoryDataList" (
    "id" SERIAL NOT NULL,
    "tag" TEXT NOT NULL,
    "valveId" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ValveHistoryDataList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ValveHistoryData" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT,
    "valveHistoryDataListId" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL DEFAULT '0',
    "treeId" INTEGER,

    CONSTRAINT "ValveHistoryData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_AnalysisTaskToValve" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "public"."_DeptToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "public"."_FactoryToRole" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "public"."_MenuToRole" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "public"."_MenuToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "public"."_PostToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "public"."_RoleToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "public"."_ValveToWorkOrder" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AnalysisTaskResult_analysisTaskId_key" ON "public"."AnalysisTaskResult"("analysisTaskId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkOrder_serial_key" ON "public"."WorkOrder"("serial");

-- CreateIndex
CREATE UNIQUE INDEX "Factory_name_key" ON "public"."Factory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_name_key" ON "public"."Menu"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_path_key" ON "public"."Menu"("path");

-- CreateIndex
CREATE UNIQUE INDEX "Post_code_key" ON "public"."Post"("code");

-- CreateIndex
CREATE UNIQUE INDEX "User_account_key" ON "public"."User"("account");

-- CreateIndex
CREATE UNIQUE INDEX "User_createBy_key" ON "public"."User"("createBy");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "public"."Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Role_value_key" ON "public"."Role"("value");

-- CreateIndex
CREATE UNIQUE INDEX "_AnalysisTaskToValve_AB_unique" ON "public"."_AnalysisTaskToValve"("A", "B");

-- CreateIndex
CREATE INDEX "_AnalysisTaskToValve_B_index" ON "public"."_AnalysisTaskToValve"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DeptToUser_AB_unique" ON "public"."_DeptToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_DeptToUser_B_index" ON "public"."_DeptToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FactoryToRole_AB_unique" ON "public"."_FactoryToRole"("A", "B");

-- CreateIndex
CREATE INDEX "_FactoryToRole_B_index" ON "public"."_FactoryToRole"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MenuToRole_AB_unique" ON "public"."_MenuToRole"("A", "B");

-- CreateIndex
CREATE INDEX "_MenuToRole_B_index" ON "public"."_MenuToRole"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MenuToUser_AB_unique" ON "public"."_MenuToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_MenuToUser_B_index" ON "public"."_MenuToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PostToUser_AB_unique" ON "public"."_PostToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_PostToUser_B_index" ON "public"."_PostToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToUser_AB_unique" ON "public"."_RoleToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToUser_B_index" ON "public"."_RoleToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ValveToWorkOrder_AB_unique" ON "public"."_ValveToWorkOrder"("A", "B");

-- CreateIndex
CREATE INDEX "_ValveToWorkOrder_B_index" ON "public"."_ValveToWorkOrder"("B");

-- AddForeignKey
ALTER TABLE "public"."AnalysisTask" ADD CONSTRAINT "AnalysisTask_dictTypeId_fkey" FOREIGN KEY ("dictTypeId") REFERENCES "public"."DictType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnalysisTask" ADD CONSTRAINT "AnalysisTask_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "public"."Factory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnalysisTaskResult" ADD CONSTRAINT "AnalysisTaskResult_analysisTaskId_fkey" FOREIGN KEY ("analysisTaskId") REFERENCES "public"."AnalysisTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pdf" ADD CONSTRAINT "Pdf_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."AnalysisTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Dept" ADD CONSTRAINT "Dept_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Dept"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DictData" ADD CONSTRAINT "DictData_dictTypeId_fkey" FOREIGN KEY ("dictTypeId") REFERENCES "public"."DictType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DictData" ADD CONSTRAINT "DictData_treeId_fkey" FOREIGN KEY ("treeId") REFERENCES "public"."DictDataTree"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DictDataTree" ADD CONSTRAINT "DictDataTree_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."DictDataTree"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkOrder" ADD CONSTRAINT "WorkOrder_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "public"."Factory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Factory" ADD CONSTRAINT "Factory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Factory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contract" ADD CONSTRAINT "Contract_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "public"."Factory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Device" ADD CONSTRAINT "Device_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "public"."Factory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Menu" ADD CONSTRAINT "Menu_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Menu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Permission" ADD CONSTRAINT "Permission_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "public"."Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_createBy_fkey" FOREIGN KEY ("createBy") REFERENCES "public"."User"("account") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Valve" ADD CONSTRAINT "Valve_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "public"."Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Valve" ADD CONSTRAINT "Valve_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "public"."Factory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ValveData" ADD CONSTRAINT "ValveData_valveId_fkey" FOREIGN KEY ("valveId") REFERENCES "public"."Valve"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ValveHistoryDataList" ADD CONSTRAINT "ValveHistoryDataList_valveId_fkey" FOREIGN KEY ("valveId") REFERENCES "public"."Valve"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ValveHistoryData" ADD CONSTRAINT "ValveHistoryData_valveHistoryDataListId_fkey" FOREIGN KEY ("valveHistoryDataListId") REFERENCES "public"."ValveHistoryDataList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AnalysisTaskToValve" ADD CONSTRAINT "_AnalysisTaskToValve_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."AnalysisTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AnalysisTaskToValve" ADD CONSTRAINT "_AnalysisTaskToValve_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Valve"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DeptToUser" ADD CONSTRAINT "_DeptToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Dept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DeptToUser" ADD CONSTRAINT "_DeptToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_FactoryToRole" ADD CONSTRAINT "_FactoryToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Factory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_FactoryToRole" ADD CONSTRAINT "_FactoryToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MenuToRole" ADD CONSTRAINT "_MenuToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MenuToRole" ADD CONSTRAINT "_MenuToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MenuToUser" ADD CONSTRAINT "_MenuToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MenuToUser" ADD CONSTRAINT "_MenuToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PostToUser" ADD CONSTRAINT "_PostToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PostToUser" ADD CONSTRAINT "_PostToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_RoleToUser" ADD CONSTRAINT "_RoleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_RoleToUser" ADD CONSTRAINT "_RoleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ValveToWorkOrder" ADD CONSTRAINT "_ValveToWorkOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Valve"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ValveToWorkOrder" ADD CONSTRAINT "_ValveToWorkOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."WorkOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

