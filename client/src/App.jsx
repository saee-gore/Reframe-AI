import { useState } from 'react';
import { useUser } from './hooks/useUser.js';
import WelcomePage from './pages/WelcomePage.jsx';
import SessionPage from './pages/SessionPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import CrisisBar from './components/CrisisBar.jsx';

// Simple view states
const VIEWS = {
  WELCOME: 'welcome',
  SESSION: 'session',
  SUMMARY: 'summary',
  HISTORY: 'history',
};

export default function App() {
  const user = useUser();
  const [view, setView] = useState(VIEWS.WELCOME);
  const [sessionData, setSessionData] = useState(null);  // { personaId, userName }
  const [summaryData, setSummaryData] = useState(null);  // { duration }

  if (view === VIEWS.SESSION && sessionData) {
    return (
      <SessionPage
        personaId={sessionData.personaId}
        userName={sessionData.userName}
        userId={user.userId}
        onEnd={(summary) => {
          setSummaryData(summary);
          setView(VIEWS.SUMMARY);
        }}
      />
    );
  }

  if (view === VIEWS.HISTORY) {
    return (
      <HistoryPage
        userId={user.userId}
        onBack={() => setView(VIEWS.WELCOME)}
      />
    );
  }

  if (view === VIEWS.SUMMARY) {
    const mins = Math.floor((summaryData?.duration || 0) / 60);
    const secs = (summaryData?.duration || 0) % 60;
    return (
      <div className="min-h-screen flex flex-col">
        <CrisisBar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Session Complete</h2>
            {summaryData?.duration > 0 && (
              <p className="text-slate-500 mb-6">
                Duration: {mins > 0 ? `${mins}m ` : ''}{secs}s
              </p>
            )}
            <div className="space-y-3">
              <button
                onClick={() => {
                  setSessionData(null);
                  setView(VIEWS.WELCOME);
                }}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Start New Session
              </button>
              <button
                onClick={() => setView(VIEWS.HISTORY)}
                className="w-full border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-3 rounded-lg transition"
              >
                View Past Sessions
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default: Welcome
  return (
    <WelcomePage
      user={user}
      onStart={({ personaId, userName }) => {
        setSessionData({ personaId, userName });
        setView(VIEWS.SESSION);
      }}
      onHistory={() => setView(VIEWS.HISTORY)}
    />
  );
}
