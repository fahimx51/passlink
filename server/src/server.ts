import 'dotenv/config';
import http from 'http';
import app from './app.js';
import { pasteCleanupWorker } from './workers/pasteCleanup.worker.js';

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});

// Graceful Shutdown for Deployment Containers (Docker, Render, Railway)
const shutdown = async () => {
    console.log('Shutting down gracefully...');
    server.close(async () => {
        await pasteCleanupWorker.close();
        console.log('BullMQ paste cleanup worker closed.');
        process.exit(0);
    });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);