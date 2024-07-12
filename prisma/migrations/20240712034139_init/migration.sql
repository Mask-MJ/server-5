/*
  Warnings:

  - Added the required column `filename` to the `Rule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Rule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rule" ADD COLUMN     "filename" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;
