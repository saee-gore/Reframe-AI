import { useState } from 'react';
import CrisisBar from '../components/CrisisBar.jsx';
import Loader from '../components/Loader.jsx';
import { api } from '../utils/api.js';

export default function WelcomePage({ user, onStart }) {
  const [name, setName] = useState(user.userName || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    setLoading(true);
    setError('');

    try {
      user.setUserName(trimmed);

      // Create or reuse persona
      let personaId = user.personaId;
      if (!personaId) {
        const result = await api.createPersona();
        personaId = result.persona_id;
        user.setPersonaId(personaId);
      }

      onStart({ personaId, userName: trimmed });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <CrisisBar />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-100 mb-4">
              <span className="text-3xl">🧠</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Reframe</h1>
            <p className="text-slate-500 mt-1">Your CBT Check-In Coach</p>
          </div>

          {loading ? (
            <Loader text="Setting up your session…" />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                  What's your first name?
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex"
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Start Session
              </button>
            </form>
          )}

          <p className="text-xs text-slate-400 text-center mt-6">
            Reframe is a coaching tool, not a licensed therapist.{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '#history';
              }}
              className="underline"
            >
              View past sessions
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
