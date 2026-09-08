/*
  Warnings:

  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fileName` to the `FileRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileSize` to the `FileRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileUrl` to the `FileRecord` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_fileRecordId_fkey";

-- AlterTable
ALTER TABLE "FileRecord" ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "fileSize" INTEGER NOT NULL,
ADD COLUMN     "fileUrl" TEXT NOT NULL,
ADD COLUMN     "mimeType" TEXT NOT NULL DEFAULT 'application/zip';

-- DropTable
DROP TABLE "File";
