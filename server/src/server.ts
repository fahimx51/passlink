import 'dotenv/config';
import http from 'http';
import app from './app.js';
import { initPasteCleanupWorker } from './workers/pasteCleanup.worker.js';
import { initFileCleanupWorker } from './workers/fileCleanup.worker.js';
import "./config/cloudinary.js";
import { initSocket } from '../socket.js';

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Store worker reference in a variable
let pasteWorker: ReturnType<typeof initPasteCleanupWorker> | null = null;
let fileWorker: ReturnType<typeof initFileCleanupWorker> | null = null;


if (process.env.RENDER === "true" || process.env.NODE_ENV === "development") {
    initSocket(server);

    pasteWorker = initPasteCleanupWorker();
    fileWorker = initFileCleanupWorker();
}

server.listen(PORT, () => {
    console.log(`Server running on port : ${PORT}`);
});

// Complete Graceful Shutdown Logic
const shutdown = async () => {
    console.log('Shutting down gracefully...');

    // Stop accepting new incoming HTTP connections
    server.close(async () => {
        // If the worker was initialized, close its Redis connection cleanly
        if (pasteWorker) {
            await pasteWorker.close();
            console.log('BullMQ paste cleanup worker closed.');
        }
        if (fileWorker) {
            await fileWorker.close();
            console.log('BullMQ file cleanup worker closed.');
        }
        process.exit(0);
    });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);