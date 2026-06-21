import { useState, useEffect, useRef } from 'react';
import CrisisBar from '../components/CrisisBar.jsx';
import Loader from '../components/Loader.jsx';
import { api } from '../utils/api.js';

export default function SessionPage({ personaId, userName, userId, onEnd }) {
  const [conversationUrl, setConversationUrl] = useState('');
  const [conversationId, setConversationId] = useState('');
  const [loading, setLoading] = useState(true);
  const [ending, setEnding] = useState(false);
  const [error, setError] = useState('');
  const iframeRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function startSession() {
      try {
        const data = await api.createConversation({ personaId, userName, userId });
        if (cancelled) return;
        setConversationUrl(data.conversation_url);
        setConversationId(data.conversation_id);
        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    startSession();
    return () => { cancelled = true; };
  }, [personaId, userName, userId]);

  const handleEnd = async () => {
    setEnding(true);
    try {
      const result = await api.endConversation(conversationId);
      onEnd({ duration: result.duration || 0 });
    } catch (err) {
      console.error('[Session] End error:', err.message);
      onEnd({ duration: 0 });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <CrisisBar />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xl">🧠</span>
          <span className="text-white font-semibold">Reframe</span>
          <span className="text-slate-400 text-sm ml-2">Session with {userName}</span>
        </div>
        <button
          onClick={handleEnd}
          disabled={ending || loading}
          className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          {ending ? 'Ending…' : 'End Session'}
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        {loading && <Loader text="Connecting to Reframe…" />}

        {error && (
          <div className="bg-red-900 text-red-200 rounded-xl p-6 max-w-md text-center">
            <p className="font-semibold mb-2">Could not start session</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={() => onEnd({ duration: 0 })}
              className="mt-4 text-sm underline opacity-70 hover:opacity-100"
            >
              ← Go back
            </button>
          </div>
        )}

        {!loading && !error && conversationUrl && (
          <div className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              ref={iframeRef}
              src={conversationUrl}
              allow="camera; microphone; autoplay; display-capture"
              className="w-full h-full border-0"
              title="Reframe CBT Coach Session"
            />
          </div>
        )}
      </main>
    </div>
  );
}
