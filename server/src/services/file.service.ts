import { prisma } from "../config/prisma";
import cloudinary from "../config/cloudinary.js";

/**
 * Permanently delete file from Cloudinary and database by ID
 */
export const deleteFileRecordAndStorage = async (fileId: string): Promise<boolean> => {
    const fileRecord = await prisma.fileRecord.findUnique({
        where: { id: fileId },
    });

    if (!fileRecord) {
        console.warn(`[File Service] File record ${fileId} not found or already deleted.`);
        return false;
    }

    // 1. Delete file from Cloudinary
    if (fileRecord.fileUrl) {
        try {
            await cloudinary.uploader.destroy(fileRecord.fileUrl, {
                resource_type: "raw",
                invalidate: true,
            });
        } catch (err) {
            console.error("[File Service] Cloudinary file deletion warning:", err);
        }
    }

    await prisma.fileRecord.delete({
        where: { id: fileId },
    });

    return true;
};