import { fileCleanupQueue, scheduleFileExpiration } from "../queues/fileCleanup.queue.js";

/**
 * Reschedule or update the expiration job if a file's TTL is updated
 */
export const updateFileExpirationJob = async (fileId: string, newExpiresAt: Date) => {
    await cancelFileExpirationJob(fileId);
    await scheduleFileExpiration(fileId, newExpiresAt);
};

/**
 * Cancel the scheduled expiration job if the file is manually deleted early
 */
export const cancelFileExpirationJob = async (fileId: string) => {
    const jobId = `expire-${fileId}`;
    const job = await fileCleanupQueue.getJob(jobId);
    if (job) {
        await job.remove();
    }
};