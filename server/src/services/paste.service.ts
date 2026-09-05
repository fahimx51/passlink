import { Response } from "express";
import { Paste } from "../generated/prisma/index.js";
import { prisma } from "../config/prisma.js";
import { pasteCleanupQueue } from "../queues/pasteCleanup.queue.js";

/**
 * Increments paste view count if not already viewed in this session,
 * sets the deduplication cookie, and triggers background cleanup if maxViews is reached.
 */
export const trackPasteView = async (
    paste: Paste,
    reqCookies: Record<string, string> | undefined,
    res: Response
): Promise<Paste> => {

    const cookieName = `viewed_paste_${paste.slug}`;
    const hasViewed = reqCookies?.[cookieName];

    if (hasViewed) {
        return paste;
    }

    // Increment view count in DB
    const updatedPaste = await prisma.paste.update({
        where: { id: paste.id },
        data: { viewCount: { increment: 1 } },
    });

    // Set 24-hour cookie to prevent refresh spam
    res.cookie(cookieName, "true", {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
    });

    // Delegate background deletion if limit is hit
    if (updatedPaste.maxViews && updatedPaste.viewCount >= updatedPaste.maxViews) {
        await prisma.paste.delete({
            where: { id: updatedPaste.id },
        });

        // Cancel the pending delayed TTL job in BullMQ (non-blocking)
        pasteCleanupQueue
            .getJob(`expire-${updatedPaste.id}`)
            .then((job) => job?.remove())
            .catch((err) => {
                console.error(
                    `[BullMQ] Failed to cancel delayed TTL job for paste ${updatedPaste.id}:`,
                    err
                );
            });
    }

    return updatedPaste;
};