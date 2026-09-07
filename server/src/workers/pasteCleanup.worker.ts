import { redis } from "../config/redis.js";
import { Worker, Job } from "bullmq";
import { prisma } from "../config/prisma.js";
import { Prisma } from "../generated/prisma";

interface CleanupJobData {
    pasteId: string;
}

export const initPasteCleanupWorker = () => {
    const pasteCleanupWorker = new Worker<CleanupJobData>(
        "paste-cleanup",
        async (job: Job<CleanupJobData>) => {
            const { pasteId } = job.data;

            try {
                await prisma.paste.delete({
                    where: { id: pasteId },
                });
                console.log("[BullMQ] Successfully deleted paste with ID:", pasteId);
            } catch (error) {
                if (
                    error instanceof Prisma.PrismaClientKnownRequestError &&
                    error.code === "P2025"
                ) {
                    // Paste was already removed (e.g., maxViews hit or manual deletion)
                    return;
                }
                throw error; // Re-throw database errors so BullMQ triggers retries
            }
        },
        {
            connection: redis,
            concurrency: 5,
        }
    );

    // Worker Lifecycle Listeners
    pasteCleanupWorker.on("ready", () => {
        console.log("[BullMQ] Paste Cleanup worker connected to Redis.");
    });

    pasteCleanupWorker.on("failed", (job, err) => {
        console.error(`[BullMQ] Paste Cleanup job failed for paste ${job?.data.pasteId}:`, err);
    });

    pasteCleanupWorker.on("error", (err) => {
        console.error("[BullMQ] Redis paste cleanup worker error:", err);
    });

    return pasteCleanupWorker;
};