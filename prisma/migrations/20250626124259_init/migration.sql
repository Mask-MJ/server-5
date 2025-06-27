-- DropIndex
DROP INDEX "public"."Menu_name_key";

-- DropIndex
DROP INDEX "public"."Menu_path_key";

-- AlterTable
ALTER TABLE "public"."Menu" ALTER COLUMN "name" SET DEFAULT '',
ALTER COLUMN "path" DROP NOT NULL;
