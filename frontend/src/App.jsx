import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Scanner from './components/Scanner';
import Analytics from './components/Analytics';
import History from './components/History';
import Sandbox from './components/Sandbox';
import LoginPage from './components/LoginPage';
import axios from 'axios';

export default function App() {
  const [activeTab, setActiveTab] = useState('scanner');
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('socialshield_token');
    if (!token) {
      setCheckingSession(false);
      return;
    }
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    axios.get('/api/auth/me')
      .then(({ data }) => setCurrentUser(data.user))
      .catch(() => {
        sessionStorage.removeItem('socialshield_token');
        delete axios.defaults.headers.common.Authorization;
      })
      .finally(() => setCheckingSession(false));
  }, []);

  const handleAnalyze = async ({ message, url }) => {
    setLoading(true);
    setScanResult(null);
    try {
      const response = await axios.post('/api/analyze', { message, url });
      setScanResult(response.data);
    } catch (err) {
      console.error('Analysis error:', err);
      alert(err.response?.data?.error || 'Failed to connect to backend server. Make sure the Node server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSample = (sample) => {
    setActiveTab('scanner');
    handleAnalyze({ message: sample.message, url: sample.url });
  };

  // If user is not logged in, render the standalone Login Page with Animated Blue Orb loader
  if (checkingSession) {
    return <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-sm font-semibold text-slate-500">Loading your secure session…</div>;
  }

  if (!currentUser) {
    return <LoginPage onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  // Render Main Dashboard when logged in
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between selection:bg-sky-500 selection:text-white">
      <div>
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
          onLogout={() => {
            axios.post('/api/auth/logout').catch(() => {});
            sessionStorage.removeItem('socialshield_token');
            delete axios.defaults.headers.common.Authorization;
            setCurrentUser(null);
            setScanResult(null);
          }}
        />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'scanner' && (
            <Scanner
              onAnalyze={handleAnalyze}
              result={scanResult}
              loading={loading}
              onClear={() => setScanResult(null)}
            />
          )}

          {activeTab === 'analytics' && <Analytics />}

          {activeTab === 'history' && <History />}

          {activeTab === 'sandbox' && (
            <Sandbox onSelectSample={handleSelectSample} />
          )}
        </main>
      </div>
    </div>
  );
}
