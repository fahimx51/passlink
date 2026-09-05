import { Queue } from "bullmq";
import { redis } from "../config/redis.js";

// Initialize BullMQ Queue reusing your existing IORedis connection
export const pasteCleanupQueue = new Queue("paste-cleanup", {
    connection: redis,
    defaultJobOptions: {
        removeOnComplete: true, // Auto-delete job metadata from Redis once done
        removeOnFail: 100,      // Keep last 100 failed jobs for debugging
    },
});

/**
 * Schedule a delayed deletion job for a paste when it expires
 */
export const schedulePasteExpiration = async (pasteId: string, expiresAt: Date) => {
    const delay = expiresAt.getTime() - Date.now();

    if (delay > 0) {
        await pasteCleanupQueue.add(
            "delete-paste",
            { pasteId },
            {
                delay,
                jobId: `expire-${pasteId}`, // Unique ID prevents duplicate jobs
            }
        );
    }
};
