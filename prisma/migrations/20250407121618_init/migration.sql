/*
  Warnings:

  - Changed the type of `endUser` on the `WorkOrder` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `valves` on the `WorkOrder` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."WorkOrder" DROP COLUMN "endUser",
ADD COLUMN     "endUser" JSONB NOT NULL,
DROP COLUMN "valves",
ADD COLUMN     "valves" JSONB NOT NULL;
