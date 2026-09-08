import { Router } from "express";
import {
    createSignedUploadUrl,
    getFileDetails,
    getFileDownloadUrl,
    deleteFileRecord,
} from "../controllers/file.controller.js";

const fileRouter = Router();

/**
 * @route   POST /api/files/upload-url
 * @desc    Generate signed URL for file upload
 */
fileRouter.post("/upload-url", createSignedUploadUrl);

/**
 * @route   GET /api/files/:slug
 * @desc    Get file metadata for UI rendering
 */
fileRouter.get("/:slug", getFileDetails);

/**
 * @route   POST /api/files/:slug/download
 * @desc    Verify password/limits and return signed download URL
 */
fileRouter.post("/:slug/download", getFileDownloadUrl);

/**
 * @route   DELETE /api/files/:slug
 * @desc    Verify password and permanently delete file record & storage object
 */
fileRouter.delete("/:slug", deleteFileRecord);

export default fileRouter;