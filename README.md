# Reframe-AI
A real-time mental wellness app powered by Tavus Conversational Video Interface (CVI). Users have structured daily CBT check-ins with an empathetic AI video coach that sees emotional cues, remembers past sessions, and escalates to human support when needed.


<img width="318" height="297" alt="Screenshot 2026-06-21 at 9 06 22 PM" src="https://github.com/user-attachments/assets/e82afd51-7792-4b6c-8729-dd7fd56c5b77" />

<img width="700" height="363" alt="Screenshot 2026-06-21 at 9 06 35 PM" src="https://github.com/user-attachments/assets/c751fa8c-02e1-4b05-8043-a5f2bc555c29" />
<img width="543" height="330" alt="Screenshot 2026-06-21 at 9 06 49 PM" src="https://github.com/user-attachments/assets/f54976f8-3fb9-41b8-91d1-bc9d6cdfaae9" />

<img width="545" height="334" alt="Screenshot 2026-06-21 at 9 07 00 PM" src="https://github.com/user-attachments/assets/7e525a2e-8c97-406a-9b37-6c5304fcf12c" />


## What it does

Reframe guides users through personalised, structured **Cognitive Behavioural Therapy check-ins** via live video. Every session follows a clinically-informed structure:

1. **Mood check** — user rates their mood (0–10); Reframe logs it and notes any visible emotion via facial perception.
2. **CBT exercise** — the AI selects the right exercise (Thought Record, Behavioural Activation, Grounding, or Cognitive Reframing) based on the mood score and perceived emotion.
3. **Micro-commitment** — the user names one concrete action to take before the next session.
4. **Memory** — a session summary is saved automatically and surfaced in the next check-in, so Reframe always picks up where it left off.

---


### Multimodal pipeline (5 layers)

| Layer | What it does |
|---|---|
| **Perception** | Real-time facial emotion awareness — ambient queries inform exercise selection |
| **LLM** | `tavus-gpt-4.1` runs the CBT session with tool calling |
| **TTS** | Cartesia voice (optional) or replica default |
| **Guardrails** | Prevents clinical diagnosis language; blocks off-topic conversation |
| **VQA** | Vision Q&A enables Reframe to describe what it sees |

### Tool calls

| Tool | When it fires | Server action |
|---|---|---|
| `log_mood_score` | User gives their score | Updates in-memory session |
| `save_session_memory` | Near session end | Persists to `.memories.json` |
| `escalate_to_human_support` | Crisis signals detected | Logs alert, sets `session.escalated=true`, returns 988 / 741741 |

---


## License

MIT — see `LICENSE` for details.

Built with [Tavus CVI API](https://tavus.io).

