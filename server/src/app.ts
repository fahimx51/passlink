import express, { type Application } from 'express';
import cors from 'cors';

const app: Application = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL, credentials: true
    }));

app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

export default app;