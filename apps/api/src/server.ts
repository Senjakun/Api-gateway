import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';

const app = express();
const PORT = process.env.PORT || 4000;

// Allowed origins for CORS
const allowedOrigins = [
  'https://quins.dev',
  'http://localhost:3000', // keep for local development
];

// CORS middleware
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (e.g., mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api/v1/auth', authRouter);

// Health-check
app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`NusaAI API running on http://localhost:${PORT}`);
});

export default app;
