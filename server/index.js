import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import personaRouter from './routes/persona.js';
import conversationRouter from './routes/conversation.js';
import webhookRouter from './routes/webhook.js';
import memoryRouter from './routes/memory.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/persona', personaRouter);
app.use('/api/conversation', conversationRouter);
app.use('/api/webhook', webhookRouter);
app.use('/api/memory', memoryRouter);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Reframe CBT Coach server running on port ${PORT}`);
});
