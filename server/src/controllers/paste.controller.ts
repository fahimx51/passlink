import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/customError.js";
import { createPasteSchema, updatePasteSchema } from "../schemas/paste.schema.js";
import { trackPasteView } from "../services/paste.service.js";
import { pasteCleanupQueue, schedulePasteExpiration } from "../queues/pasteCleanup.queue.js";

/**
 * Create a new paste
 * POST /api/pastes/create-paste
 */
export const createPaste = async (req: Request, res: Response) => {
    const validationResult = createPasteSchema.safeParse(req.body);

    if (!validationResult.success) {
        const errorMessage = validationResult.error.issues[0].message;
        throw new AppError(errorMessage, 400);
    }

    const { title, content, ttl, password, slug, maxViews } = validationResult.data;

    if (slug) {
        const existingSlug = await prisma.paste.findUnique({
            where: { slug },
        });

        if (existingSlug) {
            throw new AppError("This custom URL is already taken.", 409);
        }
    }

    let hashedPassword: string | null = null;
    if (password && password.trim() !== "") {
        hashedPassword = await bcrypt.hash(password, 10);
    }

    const expiresAt = new Date(Date.now() + ttl * 24 * 60 * 60 * 1000);

    const paste = await prisma.paste.create({
        data: {
            title,
            content,
            expiresAt,
            isPasswordLocked: !!hashedPassword,
            ...(hashedPassword && { password: hashedPassword }),
            ...(slug && { slug }),
            ...(maxViews !== undefined && { maxViews }),
        },
        select: {
            id: true,
            slug: true,
            title: true,
            isPasswordLocked: true,
            maxViews: true,
            expiresAt: true,
            createdAt: true,
        },
    });

    await schedulePasteExpiration(paste.id, expiresAt)
        .catch((err) => {
            console.error(`[BullMQ => createPaste] Failed to schedule expiration for paste ${paste.id}:`, err);
        });

    return res.status(201).json({
        success: true,
        message: "Paste created successfully.",
        data: paste,
    });
};

/**
 * Get paste content by slug (unlocked pastes)
 * GET /api/pastes/:slug
 */
export const getPaste = async (req: Request, res: Response) => {
    const { slug } = req.params;

    if (!slug || typeof slug !== "string") {
        throw new AppError("Invalid slug parameter.", 400);
    }

    const paste = await prisma.paste.findUnique({
        where: {
            slug,
            expiresAt: {
                gt: new Date(),
            },
        },
    });

    if (!paste) {
        throw new AppError("Paste not found or has expired.", 404);
    }

    if (paste.isPasswordLocked) {
        return res.status(200).json({
            success: true,
            isPasswordRequired: true,
            data: {
                title: paste.title,
                expiresAt: paste.expiresAt,
            },
            message: "This paste is password protected. Please provide the password to access its content.",
        });
    }

    // Process view increment & cookie setting via service
    const currentPaste = await trackPasteView(paste, req.cookies, res);

    const { password: _, ...safePaste } = currentPaste;

    return res.status(200).json({
        success: true,
        isPasswordRequired: false,
        data: safePaste,
        message: "Paste retrieved successfully.",
    });
};

/**
 * Access a password-protected paste
 * POST /api/pastes/:slug/access
 */
export const accessProtectedPaste = async (req: Request, res: Response) => {
    const { slug } = req.params;
    const { password } = req.body;

    if (!slug || typeof slug !== "string") {
        throw new AppError("Invalid slug parameter.", 400);
    }

    if (!password || typeof password !== "string" || password.trim() === "") {
        throw new AppError("Password is required.", 400);
    }

    const paste = await prisma.paste.findUnique({
        where: {
            slug,
            expiresAt: {
                gt: new Date(),
            },
        },
    });

    if (!paste) {
        throw new AppError("Paste not found or has expired.", 404);
    }

    if (!paste.isPasswordLocked || !paste.password) {
        throw new AppError("This paste is not password protected.", 400);
    }

    const isPasswordValid = await bcrypt.compare(password, paste.password);

    if (!isPasswordValid) {
        throw new AppError("Invalid password.", 401);
    }

    // Process view increment & cookie setting via service after password check
    const currentPaste = await trackPasteView(paste, req.cookies, res);

    const { password: _, ...safePaste } = currentPaste;

    return res.status(200).json({
        success: true,
        isPasswordRequired: false,
        message: "Paste unlocked successfully.",
        data: safePaste,
    });
};

export const updatePaste = async (req: Request, res: Response) => {
    const { slug } = req.params;

    if (!slug || typeof slug !== "string") {
        throw new AppError("Invalid slug parameter.", 400);
    }

    // Zod Schema Validation
    const validationResult = updatePasteSchema.safeParse(req.body);

    if (!validationResult.success) {
        const errorMessage = validationResult.error.issues[0].message;
        throw new AppError(errorMessage, 400);
    }

    const {
        title,
        content,
        extendTtl,
        maxViews,
        password,
        currentPassword,
    } = validationResult.data;

    // Fetch existing paste
    const existingPaste = await prisma.paste.findUnique({
        where: {
            slug,
            expiresAt: {
                gt: new Date(),
            },
        },
    });

    if (!existingPaste) {
        throw new AppError("Paste not found or has expired.", 404);
    }

    // Password Verification (If paste is currently password locked)
    if (existingPaste.isPasswordLocked && existingPaste.password) {
        if (!currentPassword) {
            throw new AppError("Current password is required to modify this paste.", 401);
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, existingPaste.password);
        if (!isPasswordValid) {
            throw new AppError("Invalid current password.", 401);
        }
    }

    // Build Dynamic Update Payload
    const updateData: Record<string, any> = {};

    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (maxViews !== undefined) updateData.maxViews = maxViews;

    // Handle TTL Extension
    if (extendTtl !== undefined) {
        const currentExpiration = new Date(existingPaste.expiresAt).getTime();
        const extendedTime = extendTtl * 24 * 60 * 60 * 1000;
        updateData.expiresAt = new Date(currentExpiration + extendedTime);
    }

    // Handle Password Updating / Adding / Removing
    if (password !== undefined) {
        if (password.trim() === "") {
            // Unlock paste by removing password
            updateData.password = null;
            updateData.isPasswordLocked = false;
        } else {
            // Add new password or update existing
            updateData.password = await bcrypt.hash(password, 10);
            updateData.isPasswordLocked = true;
        }
    }

    // Ensure at least one field is provided for update
    if (Object.keys(updateData).length === 0) {
        throw new AppError("No valid fields provided for update.", 400);
    }

    // 5. Execute Update in Database
    const updatedPaste = await prisma.paste.update({
        where: { id: existingPaste.id },
        data: updateData,
    });


    if (extendTtl !== undefined) {
        pasteCleanupQueue
            .getJob(`expire-${updatedPaste.id}`)
            .then((oldJob) => oldJob?.remove())
            .catch((err) =>
                console.error(`[BullMQ] Failed to remove old job for paste ${updatedPaste.id}:`, err)
            );

        schedulePasteExpiration(updatedPaste.id, updatedPaste.expiresAt).catch((err) =>
            console.error(`[BullMQ] Failed to reschedule expiration for paste ${updatedPaste.id}:`, err)
        );
    }

    // Strip hashed password from response payload
    const { password: _, ...safePaste } = updatedPaste;

    return res.status(200).json({
        success: true,
        message: "Paste updated successfully.",
        data: safePaste,
    });
};

export const deletePaste = async (req: Request, res: Response) => {
    const { slug } = req.params;
    const { currentPassword } = req.body;

    if (!slug || typeof slug !== "string") {
        throw new AppError("Invalid slug parameter.", 400);
    }

    // 1. Fetch paste to verify existence and check password protection
    const paste = await prisma.paste.findUnique({
        where: { slug },
    });

    if (!paste) {
        throw new AppError("Paste not found or has already been deleted.", 404);
    }

    // 2. Password Verification (If paste is password protected)
    if (paste.isPasswordLocked && paste.password) {
        if (!currentPassword || typeof currentPassword !== "string") {
            throw new AppError("Current password is required to delete this paste.", 401);
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, paste.password);
        if (!isPasswordValid) {
            throw new AppError("Invalid password.", 401);
        }
    }

    // 3. Delete paste from database
    await prisma.paste.delete({
        where: { id: paste.id },
    });

    // 4. Cancel scheduled BullMQ cleanup job (Fire and forget)
    pasteCleanupQueue
        .getJob(`expire-${paste.id}`)
        .then((job) => job?.remove())
        .catch((err) =>
            console.error(`[BullMQ] Failed to remove cleanup job for deleted paste ${paste.id}:`, err)
        );

    return res.status(200).json({
        success: true,
        message: "Paste deleted successfully.",
    });
};