import 'dotenv/config';
import { Redis } from 'ioredis';

const getRedisUrl = () => {
    if (process.env.REDIS_URL) {
        return process.env.REDIS_URL;
    }
    throw new Error('Redis connection failed: REDIS_URL is not defined in environment variables');
}

export const redis = new Redis(getRedisUrl(), {
    maxRetriesPerRequest: null, // Required by BullMQ
    enableReadyCheck: false,    // Required for serverless Redis like Upstash
    tls: {
        rejectUnauthorized: false, // Ensures TLS/SSL handshakes complete smoothly
    },
});