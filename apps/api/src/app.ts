import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import { authRouter } from './routes/auth';
import { chatRouter } from './routes/chat';
import { adminRouter } from './routes/admin';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/admin', adminRouter);

// Global error handler
app.use(errorHandler);

export { app };
