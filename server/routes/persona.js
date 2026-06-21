import express from 'express';
import { createPersona } from '../tavusClient.js';

const router = express.Router();

// POST /api/persona/create
router.post('/create', async (_req, res) => {
  try {
    const persona = await createPersona();
    res.json({ persona_id: persona.persona_id });
  } catch (err) {
    console.error('[Persona] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
