import express from 'express';
import { createConversation, endConversation } from '../tavusClient.js';

const router = express.Router();

// Active sessions: conversationId → session data
const sessions = new Map();

// POST /api/conversation/create
router.post('/create', async (req, res) => {
  const { personaId, userName, userId } = req.body;

  if (!personaId || !userName) {
    return res.status(400).json({ error: 'personaId and userName are required' });
  }

  try {
    const conversation = await createConversation({
      personaId,
      userName,
      webhookUrl: process.env.WEBHOOK_URL,
    });

    // Store session state
    sessions.set(conversation.conversation_id, {
      userId: userId || 'anonymous',
      userName,
      conversationId: conversation.conversation_id,
      startedAt: Date.now(),
      moodScore: null,
      moodNotes: null,
      escalated: false,
    });

    res.json({
      conversation_id: conversation.conversation_id,
      conversation_url: conversation.conversation_url,
    });
  } catch (err) {
    console.error('[Conversation] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/conversation/end
router.post('/end', async (req, res) => {
  const { conversationId } = req.body;
  if (!conversationId) return res.status(400).json({ error: 'conversationId required' });

  try {
    await endConversation(conversationId);
    const session = sessions.get(conversationId);
    const duration = session ? Math.round((Date.now() - session.startedAt) / 1000) : 0;
    sessions.delete(conversationId);
    res.json({ ended: true, duration });
  } catch (err) {
    console.error('[Conversation] End error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Expose sessions so webhook can mutate them
export { sessions };
export default router;
