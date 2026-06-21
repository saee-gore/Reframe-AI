import express from 'express';
import { getMemories, deleteMemories } from '../services/memoryService.js';

const router = express.Router();

// GET /api/memory/:userId
router.get('/:userId', (req, res) => {
  const memories = getMemories(req.params.userId);
  res.json({ memories });
});

// DELETE /api/memory/:userId
router.delete('/:userId', (req, res) => {
  deleteMemories(req.params.userId);
  res.json({ deleted: true });
});

export default router;
