import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is missing.");
}

// Global scope type safety
const globalForPrisma = globalThis as unknown as {
    prisma?: PrismaClient;
    pgPool?: Pool;
};

// 1. Configure the PG Pool with explicit connection settings
export const pool =
    globalForPrisma.pgPool ??
    new Pool({
        connectionString,
        max: process.env.NODE_ENV === "production" ? 20 : 5, // Connection limit based on env
        idleTimeoutMillis: 30000, // Close idle connections after 30s
        connectionTimeoutMillis: 5000, // Fail fast if DB connection hangs
    });

// 2. Initialize Driver Adapter
const adapter = new PrismaPg(pool);

// 3. Initialize Prisma Client (Only logging errors and warnings)
export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
        log: ["error", "warn"],
    });

// Preserves instances during local hot-reloads (tsx watch)
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pgPool = pool;
    globalForPrisma.prisma = prisma;
}

// 4. Graceful Shutdown Helper for deployment environments
export const disconnectDatabase = async () => {
    await prisma.$disconnect();
    await pool.end();
};