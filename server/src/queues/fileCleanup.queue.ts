import { Queue } from "bullmq";
import { redis } from "../config/redis.js";

export const fileCleanupQueue = new Queue("file-cleanup", {
    connection: redis,
    defaultJobOptions: {
        removeOnComplete: true, // Auto-delete job metadata from Redis once done
        removeOnFail: 100,      // Keep last 100 failed jobs for debugging
    },
});

/**
 * Schedule a delayed deletion job for a file when it expires
 */
export const scheduleFileExpiration = async (fileId: string, expiresAt: Date) => {
    const delay = Math.max(0, expiresAt.getTime() - Date.now());

    await fileCleanupQueue.add(
        "delete-file",
        { fileId },
        {
            delay,
            jobId: `expire-${fileId}`,
        }
    );
};

