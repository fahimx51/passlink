import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/customError.js";
import {
    createSignedUploadUrlSchema,
    getFileDownloadUrlSchema,
    deleteFileRecordSchema,
    updateFileRecordSchema,
} from "../schemas/file.schema.js";
import cloudinary from "../config/cloudinary.js";
import { deleteFileRecordAndStorage } from "../services/file.service.js";
import { cancelFileExpirationJob, updateFileExpirationJob } from "../utils/fileQueue.js";
import { scheduleFileExpiration } from "../queues/fileCleanup.queue.js";

interface SlugParam {
    slug: string;
}

/**
 * 1. POST /api/files/upload-url
 * Strips file extension from public_id to prevent double-extension bugs on Cloudinary
 */
export const createSignedUploadUrl = async (req: Request, res: Response) => {
    const { fileName, fileSize, ttl, password, slug, downloadLimit } =
        createSignedUploadUrlSchema.parse(req.body);

    if (slug) {
        const existingRecord = await prisma.fileRecord.findUnique({
            where: { slug },
        });

        if (existingRecord) {
            throw new AppError("This custom URL slug is already in use.", 409);
        }
    }

    const expiresAt = new Date(Date.now() + ttl * 24 * 60 * 60 * 1000);

    const passwordHash = password ? await bcrypt.hash(password, 10) : null;

    // Strip extension from public_id so Cloudinary handles formatting cleanly
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf(".")) || fileName;
    const publicId = `passlink_uploads/${Date.now()}_${nameWithoutExt}`;

    const fileRecord = await prisma.fileRecord.create({
        data: {
            ...(slug ? { slug } : {}),
            fileUrl: publicId, // Clean Cloudinary public_id without extension
            fileName,
            fileSize,
            mimeType: "application/zip",
            isPasswordLocked: Boolean(password),
            password: passwordHash,
            downloadLimit: downloadLimit ?? null,
            expiresAt,
        },
    });

    await scheduleFileExpiration(fileRecord.id, expiresAt);

    return res.status(201).json({
        success: true,
        data: {
            publicId: fileRecord.fileUrl,
            slug: fileRecord.slug,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        },
    });
};

/**
 * 2. GET /api/files/:slug
 */
export const getFileDetails = async (req: Request<SlugParam>, res: Response) => {
    const { slug } = req.params;

    const fileRecord = await prisma.fileRecord.findUnique({
        where: { slug },
        select: {
            id: true,
            slug: true,
            fileName: true,
            fileSize: true,
            mimeType: true,
            isPasswordLocked: true,
            downloadCount: true,
            downloadLimit: true,
            expiresAt: true,
            createdAt: true,
        },
    });

    if (!fileRecord) {
        throw new AppError("File not found or link has expired.", 404);
    }

    if (new Date() > fileRecord.expiresAt) {
        throw new AppError("This file link has expired.", 410);
    }

    if (
        fileRecord.downloadLimit !== null &&
        fileRecord.downloadCount >= fileRecord.downloadLimit
    ) {
        throw new AppError("Download limit reached for this file.", 410);
    }

    return res.status(200).json({
        success: true,
        data: { fileRecord },
    });
};

/**
 * 3. POST /api/files/:slug/download
 * Generates signed download URL without double extensions
 */
export const getFileDownloadUrl = async (
    req: Request<SlugParam>,
    res: Response
) => {
    const { slug } = req.params;
    const { password } = getFileDownloadUrlSchema.parse(req.body);

    const fileRecord = await prisma.fileRecord.findUnique({
        where: { slug },
    });

    if (!fileRecord) {
        throw new AppError("File not found or link has expired.", 404);
    }

    if (new Date() > fileRecord.expiresAt) {
        throw new AppError("This file link has expired.", 410);
    }

    if (
        fileRecord.downloadLimit !== null &&
        fileRecord.downloadCount >= fileRecord.downloadLimit
    ) {
        throw new AppError("Download limit reached for this file.", 410);
    }

    if (fileRecord.isPasswordLocked) {
        if (!password) {
            throw new AppError("Password required to download this file.", 401);
        }

        if (!fileRecord.password) {
            throw new AppError("Corrupted password record.", 500);
        }

        const isMatch = await bcrypt.compare(password, fileRecord.password);
        if (!isMatch) {
            throw new AppError("Invalid password.", 403);
        }
    }

    // Ensure publicId includes .zip extension so Cloudinary locates the raw archive
    const rawPublicId = fileRecord.fileUrl.endsWith(".zip")
        ? fileRecord.fileUrl
        : `${fileRecord.fileUrl}.zip`;

    // Generate authenticated signed URL for raw zip file
    const downloadUrl = cloudinary.url(rawPublicId, {
        resource_type: "raw",
        flags: "attachment", // Forces direct browser download
        sign_url: true,
        secure: true,
    });

    // Increment download count
    const updatedRecord = await prisma.fileRecord.update({
        where: { id: fileRecord.id },
        data: { downloadCount: { increment: 1 } },
    });

    if (
        updatedRecord.downloadLimit !== null &&
        updatedRecord.downloadCount >= updatedRecord.downloadLimit
    ) {
        await cancelFileExpirationJob(fileRecord.id);
        await deleteFileRecordAndStorage(fileRecord.id);
    }

    return res.status(200).json({
        success: true,
        data: {
            downloadUrl,
            fileName: fileRecord.fileName,
        },
    });
};

/**
 * 4. DELETE /api/files/:slug
 */
export const deleteFileRecord = async (
    req: Request<SlugParam>,
    res: Response
) => {
    const { slug } = req.params;
    const { password } = deleteFileRecordSchema.parse(req.body);

    // 1. Fetch record to verify existence and credentials
    const fileRecord = await prisma.fileRecord.findUnique({
        where: { slug },
    });

    if (!fileRecord) {
        throw new AppError("File record not found.", 404);
    }

    // 2. Password validation check
    if (fileRecord.isPasswordLocked) {
        if (!password) {
            throw new AppError("Password required to delete this file.", 401);
        }

        if (!fileRecord.password) {
            throw new AppError("Corrupted password record.", 500);
        }

        const isMatch = await bcrypt.compare(password, fileRecord.password);
        if (!isMatch) {
            throw new AppError("Invalid password.", 403);
        }
    }

    // 3. Cancel the scheduled BullMQ job so the worker doesn't run unnecessarily
    await cancelFileExpirationJob(fileRecord.id);

    // 4. Delegate Cloudinary & DB deletion to service function
    await deleteFileRecordAndStorage(fileRecord.id);

    return res.status(200).json({
        success: true,
        message: "File permanently deleted.",
    });
};

export const updateFileRecord = async (
    req: Request<SlugParam>,
    res: Response
) => {
    const { slug } = req.params;
    const body = updateFileRecordSchema.parse(req.body);

    const fileRecord = await prisma.fileRecord.findUnique({
        where: { slug },
    });

    if (!fileRecord) {
        throw new AppError("File record not found.", 404);
    }

    // Verify current password if protected
    if (fileRecord.isPasswordLocked) {
        if (!body.password) {
            throw new AppError("Current password required to edit settings.", 401);
        }

        if (!fileRecord.password) {
            throw new AppError("Corrupted password record.", 500);
        }

        const isMatch = await bcrypt.compare(body.password, fileRecord.password);
        if (!isMatch) {
            throw new AppError("Invalid current password.", 403);
        }
    }

    // Handle slug change collision check
    if (body.newSlug && body.newSlug !== fileRecord.slug) {
        const existingSlug = await prisma.fileRecord.findUnique({
            where: { slug: body.newSlug },
        });

        if (existingSlug) {
            throw new AppError("The new custom URL slug is already in use.", 409);
        }
    }

    // Calculate updated expiration if TTL passed
    let newExpiresAt = fileRecord.expiresAt;
    if (body.ttl) {
        newExpiresAt = new Date(Date.now() + body.ttl * 24 * 60 * 60 * 1000);
        await updateFileExpirationJob(fileRecord.id, newExpiresAt);
    }

    // Hash new password if provided
    let newPasswordHash = fileRecord.password;
    let isPasswordLocked = fileRecord.isPasswordLocked;

    if (body.newPassword !== undefined) {
        if (body.newPassword.trim() === "") {
            newPasswordHash = null;
            isPasswordLocked = false;
        } else {
            newPasswordHash = await bcrypt.hash(body.newPassword, 10);
            isPasswordLocked = true;
        }
    }

    const updatedRecord = await prisma.fileRecord.update({
        where: { id: fileRecord.id },
        data: {
            slug: body.newSlug || fileRecord.slug,
            expiresAt: newExpiresAt,
            password: newPasswordHash,
            isPasswordLocked,
            downloadLimit: body.downloadLimit !== undefined ? body.downloadLimit : fileRecord.downloadLimit,
        },
        select: {
            id: true,
            slug: true,
            fileName: true,
            fileSize: true,
            mimeType: true,
            isPasswordLocked: true,
            downloadCount: true,
            downloadLimit: true,
            expiresAt: true,
            createdAt: true,
        },
    });

    return res.status(200).json({
        success: true,
        message: "File settings updated successfully.",
        data: { fileRecord: updatedRecord },
    });
};