import express from 'express';
import { sessions } from './conversation.js';
import { saveMemory } from '../services/memoryService.js';

const router = express.Router();

const CRISIS_RESOURCES = {
  lifeline: '988 (Suicide & Crisis Lifeline — call or text)',
  textLine: 'Text HOME to 741741 (Crisis Text Line)',
};

function notifyEscalation(session, reason) {
  // TODO: Replace this console stub with PagerDuty / Slack webhook in production
  console.error('🚨 ESCALATION ALERT 🚨');
  console.error(`User: ${session.userName} (${session.userId})`);
  console.error(`Conversation: ${session.conversationId}`);
  console.error(`Reason: ${reason}`);
  console.error(`Resources returned: 988 + 741741`);
}

// POST /api/webhook/tavus
router.post('/tavus', (req, res) => {
  const event = req.body;
  console.log('[Webhook] Received event:', event?.event_type || event?.type);

  const eventType = event?.event_type || event?.type;
  const conversationId = event?.conversation_id;
  const toolName = event?.tool_call?.tool_name || event?.name;
  const args = event?.tool_call?.arguments || event?.arguments || {};

  if (eventType !== 'conversation.tool_call' && eventType !== 'tool_call') {
    // Acknowledge non-tool events silently
    return res.json({ received: true });
  }

  const session = sessions.get(conversationId);

  // ── log_mood_score ────────────────────────────────────────────────────────
  if (toolName === 'log_mood_score') {
    if (session) {
      session.moodScore = args.score ?? null;
      session.moodNotes = args.notes ?? null;
    }
    console.log(`[Webhook] Mood logged: ${args.score}/10 — ${args.notes || 'no notes'}`);
    return res.json({ result: 'mood_logged', score: args.score });
  }

  // ── save_session_memory ───────────────────────────────────────────────────
  if (toolName === 'save_session_memory') {
    const userId = session?.userId || 'anonymous';
    saveMemory(userId, {
      conversationId,
      takeaway: args.takeaway,
      exercise: args.exercise,
      mood_trend: args.mood_trend,
      moodScore: session?.moodScore,
    });
    console.log(`[Webhook] Memory saved for user ${userId}`);
    return res.json({ result: 'memory_saved' });
  }

  // ── escalate_to_human_support ─────────────────────────────────────────────
  if (toolName === 'escalate_to_human_support') {
    if (session) {
      session.escalated = true;
      notifyEscalation(session, args.reason);
    }
    return res.json({
      result: 'escalated',
      resources: CRISIS_RESOURCES,
      message:
        'I hear you, and I want to make sure you get the right support. Please reach out to a crisis line right now.',
    });
  }

  console.warn('[Webhook] Unknown tool:', toolName);
  return res.json({ received: true });
});

export default router;
