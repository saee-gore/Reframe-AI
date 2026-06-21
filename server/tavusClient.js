import dotenv from 'dotenv';
dotenv.config();

const TAVUS_BASE = 'https://tavusapi.com';

const headers = () => ({
  'Content-Type': 'application/json',
  'x-api-key': process.env.TAVUS_API_KEY,
});

// ─── Persona ────────────────────────────────────────────────────────────────

export async function createPersona() {
  const body = {
    persona_name: 'Reframe CBT Coach',
    system_prompt: `You are Reframe, a warm and supportive CBT (Cognitive Behavioural Therapy) check-in coach.
Your role:
1. Greet the user by name warmly.
2. Ask for a mood score from 0 (very low) to 10 (excellent). Call log_mood_score once you have it.
3. Guide a short CBT exercise — either a thought record, a 5-4-3-2-1 grounding exercise, or behavioural activation.
4. Close with a small, achievable micro-commitment the user can complete today.
5. Near the end, call save_session_memory with a brief takeaway, the exercise used, and the mood trend.

Rules:
- You are NOT a licensed therapist. Never diagnose, prescribe, or treat.
- If the user expresses hopelessness, self-harm thoughts, or a crisis, call escalate_to_human_support immediately.
- Keep responses concise and conversational. Use plain, empathetic language.
- Never mention medication.`,
    context:
      'This is a mental-wellness check-in session. The user wants a brief CBT exercise and emotional support.',
    default_replica_id: process.env.TAVUS_REPLICA_ID,
    layers: {
      llm: {
        model: 'tavus-gpt-4.1',
         tools: [
      {
        type: 'function',
        function: {
          name: 'log_mood_score',
          description: 'Log the user\'s self-reported mood score (0–10) at session start.',
          parameters: {
            type: 'object',
            properties: {
              score: { type: 'number', description: 'Mood score 0–10' },
              notes: { type: 'string', description: 'Brief note about the mood context' },
            },
            required: ['score'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'save_session_memory',
          description: 'Save a memory of this session near the end of the conversation.',
          parameters: {
            type: 'object',
            properties: {
              takeaway: { type: 'string', description: 'Key takeaway from the session' },
              exercise: { type: 'string', description: 'CBT exercise used' },
              mood_trend: {
                type: 'string',
                enum: ['improving', 'stable', 'declining'],
                description: 'Overall mood trend observed',
              },
            },
            required: ['takeaway', 'exercise', 'mood_trend'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'escalate_to_human_support',
          description:
            'Call this immediately if the user expresses crisis, self-harm, or hopelessness.',
          parameters: {
            type: 'object',
            properties: {
              reason: { type: 'string', description: 'Brief description of the crisis signal' },
            },
            required: ['reason'],
          },
        },
      },
    ],
        ...(process.env.TAVUS_VOICE_ID
          ? { voice_id: process.env.TAVUS_VOICE_ID }
          : {}),
        speculative_inference: true,
      },
      // Guardrails — prevent clinical / diagnostic language
      guardrails: {
        banned_phrases: [
          'you have depression',
          'you have anxiety',
          'you should take medication',
          'diagnose',
          'clinical diagnosis',
          'mental illness',
          'psychiatric',
        ],
        sensitive_topics: 'mental_health',
        interrupted_response: 'Please speak with a licensed professional for clinical advice.',
      },
    },
    // Tool definitions
   
  };

  const res = await fetch(`${TAVUS_BASE}/v2/personas`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Tavus createPersona failed: ${res.status} ${err}`);
  }
  return res.json();
}

// ─── Conversation ────────────────────────────────────────────────────────────

export async function createConversation({ personaId, userName, webhookUrl }) {
  const body = {
    persona_id: personaId,
    replica_id: process.env.TAVUS_REPLICA_ID,
    conversational_context: `The user's name is ${userName}. Greet them by name.`,
    properties: {
      enable_recording: false,
      apply_greenscreen: false,
      language: 'english',
    },
    ...(webhookUrl ? { callback_url: webhookUrl } : {}),
  };

  const res = await fetch(`${TAVUS_BASE}/v2/conversations`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Tavus createConversation failed: ${res.status} ${err}`);
  }
  return res.json();
}

// ─── End conversation ────────────────────────────────────────────────────────

export async function endConversation(conversationId) {
  const res = await fetch(`${TAVUS_BASE}/v2/conversations/${conversationId}/end`, {
    method: 'POST',
    headers: headers(),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Tavus endConversation failed: ${res.status} ${err}`);
  }
  return res.json();
}
