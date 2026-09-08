import { z } from "zod";

// 1. Schema for POST /api/files/upload-url
export const createSignedUploadUrlSchema = z.object({
    fileName: z
        .string("fileName must be a string")
        .min(1, "fileName is required"),

    fileSize: z
        .number("fileSize must be a number")
        .min(1, "fileSize must be atleast 1 byte")
        .max(20 * 1024 * 1024, "fileSize can be atmost 20 MB"),

    ttl: z
        .number("ttl must be a number, not a string")
        .min(1, "ttl must be at least 1 day")
        .max(15, "ttl must be at most 15 days"),

    password: z
        .string("password must be a string")
        .min(4, "Password must be at least 4 characters long.")
        .optional(),

    slug: z
        .string()
        .regex(
            /^[a-zA-Z0-9_-]+$/,
            "Custom URL slug can only contain letters, numbers, hyphens, and underscores."
        )
        .optional(),

    downloadLimit: z
        .number("downloadLimit must be a number")
        .int("downloadLimit must be an integer")
        .positive("downloadLimit must be greater than 0")
        .optional(),
});

// 2. Schema for POST /api/files/:slug/download
export const getFileDownloadUrlSchema = z.object({
    password: z
        .string("password must be a string")
        .optional(),
});

// 3. Schema for DELETE /api/files/:slug
export const deleteFileRecordSchema = z.object({
    password: z
        .string("password must be a string")
        .optional(),
});

// Inferred TypeScript Types
export type CreateSignedUploadUrlInput = z.infer<typeof createSignedUploadUrlSchema>;
export type GetFileDownloadUrlInput = z.infer<typeof getFileDownloadUrlSchema>;
export type DeleteFileRecordInput = z.infer<typeof deleteFileRecordSchema>;