import { useState, useEffect } from 'react';
import CrisisBar from '../components/CrisisBar.jsx';
import MoodChip from '../components/MoodChip.jsx';
import Loader from '../components/Loader.jsx';
import { api } from '../utils/api.js';

export default function HistoryPage({ userId, onBack }) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.getMemories(userId)
      .then((data) => setMemories(data.memories || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  const handleDelete = async () => {
    if (!confirm('Delete all session memories? This cannot be undone.')) return;
    setDeleting(true);
    await api.deleteMemories(userId);
    setMemories([]);
    setDeleting(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <CrisisBar />
      <div className="max-w-2xl mx-auto w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <button onClick={onBack} className="text-sm text-brand-600 hover:underline mb-1">
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-slate-900">Past Sessions</h1>
          </div>
          {memories.length > 0 && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-sm text-red-500 hover:underline disabled:opacity-50"
            >
              {deleting ? 'Deleting…' : 'Delete all'}
            </button>
          )}
        </div>

        {loading && <Loader text="Loading memories…" />}

        {!loading && memories.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <p className="text-4xl mb-3">📭</p>
            <p>No sessions yet. Complete a session to see your memories here.</p>
          </div>
        )}

        <div className="space-y-4">
          {memories.map((m, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-xs text-slate-400">
                    {new Date(m.timestamp).toLocaleString()}
                  </p>
                  {m.moodScore != null && (
                    <p className="text-sm font-medium text-slate-700 mt-0.5">
                      Mood score: <span className="text-brand-600 font-bold">{m.moodScore}/10</span>
                    </p>
                  )}
                </div>
                {m.mood_trend && <MoodChip trend={m.mood_trend} />}
              </div>

              {m.exercise && (
                <p className="text-sm text-slate-600 mb-2">
                  <span className="font-medium">Exercise:</span> {m.exercise}
                </p>
              )}
              {m.takeaway && (
                <p className="text-sm text-slate-700 bg-brand-50 rounded-lg p-3 border border-brand-100">
                  {m.takeaway}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
