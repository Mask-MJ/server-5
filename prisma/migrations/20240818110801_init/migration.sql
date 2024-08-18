-- DropForeignKey
ALTER TABLE "public"."Valve" DROP CONSTRAINT "Valve_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Valve" DROP CONSTRAINT "Valve_factoryId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Valve" ADD CONSTRAINT "Valve_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "public"."Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Valve" ADD CONSTRAINT "Valve_factoryId_fkey" FOREIGN KEY ("factoryId") REFERENCES "public"."Factory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
