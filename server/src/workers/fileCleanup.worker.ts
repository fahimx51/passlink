import { Worker, Job } from "bullmq";
import { redis } from "../config/redis.js";
import { deleteFileRecordAndStorage } from "../services/file.service.js";

interface FileCleanupJobData {
    fileId: string;
}

export const initFileCleanupWorker = () => {
    const fileCleanupWorker = new Worker<FileCleanupJobData>(
        "file-cleanup",
        async (job: Job<FileCleanupJobData>) => {
            const { fileId } = job.data;
            console.log(`[Worker] Processing expiration for file: ${fileId}`);

            // Perform actual cleanup (deleting from storage & database)
            await deleteFileRecordAndStorage(fileId);
        },
        {
            connection: redis,
            concurrency: 5,
            drainDelay: 5000, // Waits 5s when queue is empty to reduce Redis polling
        }
    );

    // Worker Lifecycle Listeners
    fileCleanupWorker.on("ready", () => {
        console.log("[BullMQ] File Cleanup worker connected to Redis.");
    });

    fileCleanupWorker.on("completed", (job) => {
        console.log(`[BullMQ] File Cleanup job completed for file: ${job.data.fileId}`);
    });

    fileCleanupWorker.on("failed", (job, err) => {
        console.error(`[BullMQ] File Cleanup job failed for file ${job?.data.fileId}:`, err);
    });

    fileCleanupWorker.on("error", (err) => {
        console.error("[Worker] Redis file cleanup worker error:", err);
    });

    // Handle graceful shutdown on server exit / restart
    const handleShutdown = async () => {
        console.log("[Worker] Closing file cleanup worker...");
        await fileCleanupWorker.close();
    };

    process.once("SIGINT", handleShutdown);
    process.once("SIGTERM", handleShutdown);

    return fileCleanupWorker;
};