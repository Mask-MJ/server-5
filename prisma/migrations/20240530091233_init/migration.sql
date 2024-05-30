/*
  Warnings:

  - You are about to drop the column `path` on the `Pdf` table. All the data in the column will be lost.
  - Added the required column `url` to the `Pdf` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pdf" DROP COLUMN "path",
ADD COLUMN     "url" TEXT NOT NULL;
