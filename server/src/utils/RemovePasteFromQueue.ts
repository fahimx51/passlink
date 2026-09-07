import { pasteCleanupQueue } from "../queues/pasteCleanup.queue.js";

/**
 * Safely cancels and removes a scheduled paste cleanup job from BullMQ.
 */
export const removePasteFromQueue = async (pasteId: string): Promise<void> => {
    try {
        const job = await pasteCleanupQueue.getJob(`expire-${pasteId}`);
        if (job) {
            await job.remove();
        }
    } catch (err) {
        console.error(`[BullMQ] Failed to remove job for paste ${pasteId}:`, err);
    }
};