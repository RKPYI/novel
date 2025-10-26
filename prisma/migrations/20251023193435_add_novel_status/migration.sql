/*
  Warnings:

  - The `status` column on the `Novel` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "NovelStatus" AS ENUM ('ONGOING', 'COMPLETED', 'HIATUS');

-- AlterTable
ALTER TABLE "Novel" DROP COLUMN "status",
ADD COLUMN     "status" "NovelStatus" NOT NULL DEFAULT 'ONGOING';
