import express, { Request, Response, NextFunction, type Application } from 'express';
import cors from 'cors';
import pasteRouter from './routes/paste.route';
import { AppError } from './utils/customError';
import { ErrorMiddleware } from './middleware/errorHandler';
import cookieParser from "cookie-parser";


const app: Application = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL, credentials: true
    }));

app.use(express.json({ limit: '1mb' }));

app.use(cookieParser());


//apis

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