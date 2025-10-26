/*
  Warnings:

  - You are about to drop the column `publishedAT` on the `Chapter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chapter" DROP COLUMN "publishedAT",
ADD COLUMN     "publishedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Novel" ADD COLUMN     "publishedAt" TIMESTAMP(3);
