import express, { Request, Response, NextFunction, type Application } from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import pasteRouter from './routes/paste.route.js';
import { AppError } from './utils/customError.js';
import { ErrorMiddleware } from './middleware/errorHandler.js';

const app: Application = express();


const allowedOrigin = process.env.CLIENT_URL || "http://localhost:3000";

app.use(
    cors({
        origin: allowedOrigin,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    })
);

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// APIs
app.use('/api/pastes', pasteRouter);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use((req: Request, res: Response, next: NextFunction) => {
    next(
        new AppError(
            `Cannot find requested endpoint: ${req.method} ${req.originalUrl}`,
            404
        )
    );
});

// Global Error Handling Middleware
app.use(ErrorMiddleware);

export default app;