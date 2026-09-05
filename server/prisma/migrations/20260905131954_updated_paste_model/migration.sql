/*
  Warnings:

  - You are about to drop the column `passwordHash` on the `FileShare` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `Paste` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FileShare" DROP COLUMN "passwordHash",
ADD COLUMN     "password" TEXT;

-- AlterTable
ALTER TABLE "Paste" DROP COLUMN "passwordHash",
ADD COLUMN     "password" TEXT;
