import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../config/prisma.js";
import { bucket } from "../config/firebase.js";
import { AppError } from "../utils/customError.js";
import {
    createSignedUploadUrlSchema,
    getFileDownloadUrlSchema,
    deleteFileRecordSchema,
} from "../schemas/file.schema.js";

interface SlugParam {
    slug: string;
}

/**
 * 1. POST /api/files/upload-url
 * Validates metadata, calculates expiration, creates FileRecord,
 * and generates a 15-minute Firebase v4 PUT upload URL.
 */
export const createSignedUploadUrl = async (req: Request, res: Response) => {
    // Use .parse() to extract validated values
    const { fileName, fileSize, ttl, password, slug, downloadLimit } =
        createSignedUploadUrlSchema.parse(req.body);

    // If custom slug provided, check availability
    if (slug) {
        const existingRecord = await prisma.fileRecord.findUnique({
            where: { slug },
        });

        if (existingRecord) {
            throw new AppError("This custom URL slug is already in use.", 409);
        }
    }

    // Calculate expiration date from TTL in days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + ttl);

    const storagePath = `uploads/${Date.now()}_${fileName}`;
    const passwordHash = password ? await bcrypt.hash(password, 10) : null;

    const fileRecord = await prisma.fileRecord.create({
        data: {
            ...(slug ? { slug } : {}),
            fileUrl: storagePath,
            fileName,
            fileSize,
            mimeType: "application/zip",
            isPasswordLocked: Boolean(password),
            password: passwordHash,
            downloadLimit: downloadLimit ?? null,
            expiresAt,
        },
    });

    // Generate 15-minute v4 PUT signed URL
    const [uploadUrl] = await bucket.file(storagePath).getSignedUrl({
        version: "v4",
        action: "write",
        expires: Date.now() + 15 * 60 * 1000,
        contentType: "application/zip",
    });

    return res.status(201).json({
        success: true,
        data: {
            uploadUrl,
            slug: fileRecord.slug,
        },
    });
};

/**
 * 2. GET /api/files/:slug
 * Retrieves public file metadata for rendering download page UI.
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
 * Validates password, checks limits, increments download counter,
 * and returns a 15-minute Firebase v4 READ signed URL.
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

    const [downloadUrl] = await bucket.file(fileRecord.fileUrl).getSignedUrl({
        version: "v4",
        action: "read",
        expires: Date.now() + 15 * 60 * 1000,
    });

    await prisma.fileRecord.update({
        where: { id: fileRecord.id },
        data: { downloadCount: { increment: 1 } },
    });

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
 * Validates password, removes file object from Firebase,
 * and deletes row from Prisma DB.
 */
export const deleteFileRecord = async (
    req: Request<SlugParam>,
    res: Response
) => {
    const { slug } = req.params;
    const { password } = deleteFileRecordSchema.parse(req.body);

    const fileRecord = await prisma.fileRecord.findUnique({
        where: { slug },
    });

    if (!fileRecord) {
        throw new AppError("File record not found.", 404);
    }

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

    // Delete object from Firebase Storage
    await bucket.file(fileRecord.fileUrl).delete({ ignoreNotFound: true });

    // Delete record from Prisma DB
    await prisma.fileRecord.delete({
        where: { id: fileRecord.id },
    });

    return res.status(200).json({
        success: true,
        message: "File permanently deleted.",
    });
};