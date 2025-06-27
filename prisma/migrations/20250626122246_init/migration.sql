/*
  Warnings:

  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Permission" DROP CONSTRAINT "Permission_menuId_fkey";

-- AlterTable
ALTER TABLE "public"."Menu" ADD COLUMN     "permission" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'C';

-- DropTable
DROP TABLE "public"."Permission";
