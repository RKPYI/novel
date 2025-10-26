/*
  Warnings:

  - The values [ONGOING,COMPLETED,HIATUS] on the enum `NovelStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NovelStatus_new" AS ENUM ('ongoing', 'completed', 'hiatus');
ALTER TABLE "public"."Novel" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Novel" ALTER COLUMN "status" TYPE "NovelStatus_new" USING ("status"::text::"NovelStatus_new");
ALTER TYPE "NovelStatus" RENAME TO "NovelStatus_old";
ALTER TYPE "NovelStatus_new" RENAME TO "NovelStatus";
DROP TYPE "public"."NovelStatus_old";
ALTER TABLE "Novel" ALTER COLUMN "status" SET DEFAULT 'ongoing';
COMMIT;

-- AlterTable
ALTER TABLE "Novel" ALTER COLUMN "status" SET DEFAULT 'ongoing';
