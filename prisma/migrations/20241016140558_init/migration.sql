-- AlterTable
ALTER TABLE "public"."DictData" ADD COLUMN     "chartType" TEXT DEFAULT '0',
ADD COLUMN     "isChart" BOOLEAN DEFAULT false,
ADD COLUMN     "lowerLimit" TEXT,
ADD COLUMN     "upperLimit" TEXT;
