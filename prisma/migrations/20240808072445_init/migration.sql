-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "basic";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "flask_ocrt";

-- CreateTable
CREATE TABLE "basic"."User" (
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
CREATE TABLE "basic"."Post" (
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
CREATE TABLE "basic"."Dept" (
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
CREATE TABLE "basic"."Role" (
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
CREATE TABLE "basic"."Permission" (
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
CREATE TABLE "basic"."Menu" (
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
CREATE TABLE "basic"."DictType" (
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
CREATE TABLE "basic"."DictData" (
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

    CONSTRAINT "DictData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "basic"."DictDataTree" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "remark" TEXT,
    "parentId" INTEGER,

    CONSTRAINT "DictDataTree_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "basic"."Unit" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "basic"."OperationLog" (
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
CREATE TABLE "basic"."LoginLog" (
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
CREATE TABLE "basic"."Factory" (
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

    CONSTRAINT "Factory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "basic"."Contract" (
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
CREATE TABLE "basic"."Device" (
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
CREATE TABLE "basic"."Valve" (
    "id" SERIAL NOT NULL,
    "tag" TEXT NOT NULL,
    "unit" TEXT,
    "fluidName" TEXT,
    "criticalApplication" TEXT,
    "serialNumber" TEXT,
    "since" TIMESTAMP(3),
    "valveBrand" TEXT,
    "valveType" TEXT,
    "valveSize" TEXT,
    "valveEndConnection" TEXT,
    "valveBodyMaterial" TEXT,
    "valveBonnet" TEXT,
    "valveTrim" TEXT,
    "valveSeatLeakage" TEXT,
    "valveDescription" TEXT,
    "actuatorBrand" TEXT,
    "actuatorType" TEXT,
    "actuatorSize" TEXT,
    "handwheel" TEXT,
    "actuatorDescription" TEXT,
    "positionerBrand" TEXT,
    "positionerType" TEXT,
    "positionerDescription" TEXT,
    "accessory" TEXT,
    "accessoryBrand" TEXT,
    "accessoryType" TEXT,
    "accessoryQuantity" INTEGER,
    "accessoryDescription" TEXT,
    "instrumentBrand" TEXT,
    "instrumentType" TEXT,
    "instrumentDescription" TEXT,
    "remark" TEXT,
    "factoryId" INTEGER NOT NULL,
    "deviceId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createBy" TEXT NOT NULL DEFAULT '',
    "updateBy" TEXT,
    "analysisTaskId" INTEGER,

    CONSTRAINT "Valve_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "basic"."ValveData" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT,
    "valveId" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ValveData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "basic"."ValveHistoryDataList" (
    "id" SERIAL NOT NULL,
    "tag" TEXT NOT NULL,
    "valveId" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ValveHistoryDataList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "basic"."ValveHistoryData" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT,
    "valveHistoryDataListId" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ValveHistoryData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "basic"."AnalysisTask" (
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
CREATE TABLE "basic"."AnalysisTaskResult" (
    "id" SERIAL NOT NULL,
    "analysisTaskId" INTEGER NOT NULL,
    "tag" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "data" JSONB,

    CONSTRAINT "AnalysisTaskResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "basic"."Pdf" (
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
CREATE TABLE "basic"."Rule" (
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
CREATE TABLE "basic"."RedisData" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RedisData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "basic"."_PostToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "basic"."_DeptToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "basic"."_RoleToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "basic"."_MenuToRole" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "basic"."_MenuToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "basic"."_FactoryToRole" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_account_key" ON "basic"."User"("account");

-- CreateIndex
CREATE UNIQUE INDEX "User_createBy_key" ON "basic"."User"("createBy");

-- CreateIndex
CREATE UNIQUE INDEX "Post_code_key" ON "basic"."Post"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "basic"."Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Role_value_key" ON "basic"."Role"("value");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_name_key" ON "basic"."Menu"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_path_key" ON "basic"."Menu"("path");

-- CreateIndex
CREATE UNIQUE INDEX "Factory_name_key" ON "basic"."Factory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AnalysisTaskResult_analysisTaskId_key" ON "basic"."AnalysisTaskResult"("analysisTaskId");

-- CreateIndex
CREATE UNIQUE INDEX "_PostToUser_AB_unique" ON "basic"."_PostToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_PostToUser_B_index" ON "basic"."_PostToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DeptToUser_AB_unique" ON "basic"."_DeptToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_DeptToUser_B_index" ON "basic"."_DeptToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToUser_AB_unique" ON "basic"."_RoleToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToUser_B_index" ON "basic"."_RoleToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MenuToRole_AB_unique" ON "basic"."_MenuToRole"("A", "B");

-- CreateIndex
CREATE INDEX "_MenuToRole_B_index" ON "basic"."_MenuToRole"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MenuToUser_AB_unique" ON "basic"."_MenuToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_MenuToUser_B_index" ON "basic"."_MenuToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FactoryToRole_AB_unique" ON "basic"."_FactoryToRole"("A", "B");

-- CreateIndex
CREATE INDEX "_FactoryToRole_B_index" ON "basic"."_FactoryToRole"("B");

-- AddForeignKey
ALTER TABLE "basic"."User" ADD CONSTRAINT "User_createBy_fkey" FOREIGN KEY ("createBy") REFERENCES "basic"."User"("account") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic"."Dept" ADD CONSTRAINT "Dept_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "basic"."Dept"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic"."Permission" ADD CONSTRAINT "Permission_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "basic"."Menu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic"."Menu" ADD CONSTRAINT "Menu_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "basic"."Menu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic"."DictData" ADD CONSTRAINT "DictData_dictTypeId_fkey" FOREIGN KEY ("dictTypeId") REFERENCES "basic"."DictType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic"."DictData" ADD CONSTRAINT "DictData_treeId_fkey" FOREIGN KEY ("treeId") REFERENCES "basic"."DictDataTree"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic"."DictDataTree" ADD CONSTRAINT "DictDataTree_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "basic"."DictDataTree"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic"."Factory" ADD CONSTRAINT "Factory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "basic"."Factory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic"."Contract" ADD CONSTRAINT "Contract_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "basic"."Factory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic"."Device" ADD CONSTRAINT "Device_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "basic"."Factory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic"."Valve" ADD CONSTRAINT "Valve_analysisTaskId_fkey" FOREIGN KEY ("analysisTaskId") REFERENCES "basic"."AnalysisTask"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic"."Valve" ADD CONSTRAINT "Valve_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "basic"."Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic"."Valve" ADD CONSTRAINT "Valve_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "basic"."Factory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic"."ValveData" ADD CONSTRAINT "ValveData_valveId_fkey" FOREIGN KEY ("valveId") REFERENCES "basic"."Valve"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic"."ValveHistoryDataList" ADD CONSTRAINT "ValveHistoryDataList_valveId_fkey" FOREIGN KEY ("valveId") REFERENCES "basic"."Valve"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic"."ValveHistoryData" ADD CONSTRAINT "ValveHistoryData_valveHistoryDataListId_fkey" FOREIGN KEY ("valveHistoryDataListId") REFERENCES "basic"."ValveHistoryDataList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic"."AnalysisTask" ADD CONSTRAINT "AnalysisTask_dictTypeId_fkey" FOREIGN KEY ("dictTypeId") REFERENCES "basic"."DictType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic"."AnalysisTask" ADD CONSTRAINT "AnalysisTask_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "basic"."Factory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic"."AnalysisTaskResult" ADD CONSTRAINT "AnalysisTaskResult_analysisTaskId_fkey" FOREIGN KEY ("analysisTaskId") REFERENCES "basic"."AnalysisTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic"."Pdf" ADD CONSTRAINT "Pdf_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "basic"."AnalysisTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic"."_PostToUser" ADD CONSTRAINT "_PostToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "basic"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic"."_PostToUser" ADD CONSTRAINT "_PostToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "basic"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic"."_DeptToUser" ADD CONSTRAINT "_DeptToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "basic"."Dept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic"."_DeptToUser" ADD CONSTRAINT "_DeptToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "basic"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic"."_RoleToUser" ADD CONSTRAINT "_RoleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "basic"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic"."_RoleToUser" ADD CONSTRAINT "_RoleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "basic"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic"."_MenuToRole" ADD CONSTRAINT "_MenuToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "basic"."Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic"."_MenuToRole" ADD CONSTRAINT "_MenuToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "basic"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic"."_MenuToUser" ADD CONSTRAINT "_MenuToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "basic"."Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic"."_MenuToUser" ADD CONSTRAINT "_MenuToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "basic"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic"."_FactoryToRole" ADD CONSTRAINT "_FactoryToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "basic"."Factory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "basic"."_FactoryToRole" ADD CONSTRAINT "_FactoryToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "basic"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
