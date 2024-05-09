/*
  Warnings:

  - You are about to drop the column `operatorName` on the `OperationLog` table. All the data in the column will be lost.
  - You are about to drop the column `loginDate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `loginIp` on the `User` table. All the data in the column will be lost.
  - The `sex` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `account` to the `OperationLog` table without a default value. This is not possible if the table is not empty.
  - Made the column `nickname` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_createBy_fkey";

-- DropForeignKey
ALTER TABLE "Dept" DROP CONSTRAINT "Dept_createBy_fkey";

-- DropForeignKey
ALTER TABLE "Device" DROP CONSTRAINT "Device_createBy_fkey";

-- DropForeignKey
ALTER TABLE "DictData" DROP CONSTRAINT "DictData_createBy_fkey";

-- DropForeignKey
ALTER TABLE "DictType" DROP CONSTRAINT "DictType_createBy_fkey";

-- DropForeignKey
ALTER TABLE "Factory" DROP CONSTRAINT "Factory_createBy_fkey";

-- DropForeignKey
ALTER TABLE "LoginLog" DROP CONSTRAINT "LoginLog_account_fkey";

-- DropForeignKey
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_createBy_fkey";

-- DropForeignKey
ALTER TABLE "OperationLog" DROP CONSTRAINT "OperationLog_operatorName_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_createBy_fkey";

-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_createBy_fkey";

-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_phonenumber_key";

-- AlterTable
ALTER TABLE "OperationLog" DROP COLUMN "operatorName",
ADD COLUMN     "account" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "loginDate",
DROP COLUMN "loginIp",
ALTER COLUMN "nickname" SET NOT NULL,
ALTER COLUMN "nickname" SET DEFAULT '',
ALTER COLUMN "email" SET DEFAULT '',
ALTER COLUMN "phonenumber" SET DEFAULT '',
DROP COLUMN "sex",
ADD COLUMN     "sex" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "_PostToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_DeptToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_RoleToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MenuToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PostToUser_AB_unique" ON "_PostToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_PostToUser_B_index" ON "_PostToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DeptToUser_AB_unique" ON "_DeptToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_DeptToUser_B_index" ON "_DeptToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToUser_AB_unique" ON "_RoleToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToUser_B_index" ON "_RoleToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MenuToUser_AB_unique" ON "_MenuToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_MenuToUser_B_index" ON "_MenuToUser"("B");

-- AddForeignKey
ALTER TABLE "_PostToUser" ADD CONSTRAINT "_PostToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToUser" ADD CONSTRAINT "_PostToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeptToUser" ADD CONSTRAINT "_DeptToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Dept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeptToUser" ADD CONSTRAINT "_DeptToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToUser" ADD CONSTRAINT "_RoleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToUser" ADD CONSTRAINT "_RoleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuToUser" ADD CONSTRAINT "_MenuToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuToUser" ADD CONSTRAINT "_MenuToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
