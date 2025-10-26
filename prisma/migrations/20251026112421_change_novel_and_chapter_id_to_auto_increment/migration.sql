/*
  Warnings:

  - The primary key for the `Chapter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Chapter` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Novel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Novel` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `novelId` on the `Chapter` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."Chapter" DROP CONSTRAINT "Chapter_novelId_fkey";

-- AlterTable
ALTER TABLE "Chapter" DROP CONSTRAINT "Chapter_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "novelId",
ADD COLUMN     "novelId" INTEGER NOT NULL,
ADD CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Novel" DROP CONSTRAINT "Novel_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Novel_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_novelId_fkey" FOREIGN KEY ("novelId") REFERENCES "Novel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
