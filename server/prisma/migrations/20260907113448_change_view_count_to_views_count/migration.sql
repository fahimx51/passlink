/*
  Warnings:

  - You are about to drop the column `viewCount` on the `Paste` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Paste" DROP COLUMN "viewCount",
ADD COLUMN     "viewsCount" INTEGER NOT NULL DEFAULT 0;
