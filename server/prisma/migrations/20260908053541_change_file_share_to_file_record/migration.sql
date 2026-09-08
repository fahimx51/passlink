/*
  Warnings:

  - You are about to drop the column `fileShareId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the `FileShare` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fileRecordId` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_fileShareId_fkey";

-- DropForeignKey
ALTER TABLE "FileShare" DROP CONSTRAINT "FileShare_userId_fkey";

-- DropIndex
DROP INDEX "File_fileShareId_idx";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "fileShareId",
ADD COLUMN     "fileRecordId" TEXT NOT NULL;

-- DropTable
DROP TABLE "FileShare";

-- CreateTable
CREATE TABLE "FileRecord" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isPasswordLocked" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "downloadLimit" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "FileRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FileRecord_slug_key" ON "FileRecord"("slug");

-- CreateIndex
CREATE INDEX "FileRecord_slug_idx" ON "FileRecord"("slug");

-- CreateIndex
CREATE INDEX "FileRecord_expiresAt_idx" ON "FileRecord"("expiresAt");

-- CreateIndex
CREATE INDEX "FileRecord_userId_idx" ON "FileRecord"("userId");

-- CreateIndex
CREATE INDEX "File_fileRecordId_idx" ON "File"("fileRecordId");

-- AddForeignKey
ALTER TABLE "FileRecord" ADD CONSTRAINT "FileRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_fileRecordId_fkey" FOREIGN KEY ("fileRecordId") REFERENCES "FileRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
