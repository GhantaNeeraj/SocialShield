import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function LoginPage({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isEnteringDashboard, setIsEnteringDashboard] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError('');
    try {
      const { data } = await axios.post(isSignUp ? '/api/auth/register' : '/api/auth/login', {
        email: email.trim(), password
      });
      sessionStorage.setItem('socialshield_token', data.token);
      axios.defaults.headers.common.Authorization = `Bearer ${data.token}`;
      setIsEnteringDashboard(true);
      window.setTimeout(() => onLoginSuccess(data.user), 850);
    } catch (err) {
      setIsAuthenticating(false);
      setError(err.response?.data?.error || 'Could not connect to the sign-in service. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-sky-500 selection:text-white">
      
      {/* Ambient Radial Gradient Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none"></div>

      {isEnteringDashboard ? (
        <div className="relative z-10 flex flex-col items-center gap-5 text-center" role="status" aria-live="polite">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[3px] border-sky-100 border-t-sky-600 animate-spin" />
            <ShieldCheck className="h-8 w-8 text-sky-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Loading your dashboard</h2>
            <p className="mt-1 text-sm text-slate-500">Your account is ready.</p>
          </div>
        </div>
      ) : (
      <div className="w-full max-w-md white-panel rounded-3xl p-8 border border-slate-200/90 shadow-2xl shadow-sky-900/10 z-10 relative bg-white">
            
            {/* Logo Header */}
            <div className="text-center space-y-2 mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-sky-500/25 mb-2">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <ShieldCheck className="w-9 h-9 text-sky-600" />
                </div>
              </div>

              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                  Social<span className="text-sky-600">Shield</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {isSignUp ? 'Create your threat analyst account' : 'Sign in to access your security intelligence portal'}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="grid grid-cols-2 p-1 bg-slate-100/80 rounded-2xl mb-6 border border-slate-200/80">
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`py-2 text-xs font-extrabold rounded-xl transition-all ${
                  !isSignUp ? 'bg-white text-sky-700 shadow-sm border border-slate-200/80' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`py-2 text-xs font-extrabold rounded-xl transition-all ${
                  isSignUp ? 'bg-white text-sky-700 shadow-sm border border-slate-200/80' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Email address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    maxLength={254}
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    minLength={isSignUp ? 8 : undefined}
                    pattern={isSignUp ? '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}' : undefined}
                    title={isSignUp ? 'Use at least 8 characters, including uppercase, lowercase, and a number.' : undefined}
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-2xl bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all font-medium"
                  />
                </div>
                {isSignUp && <p className="text-[11px] text-slate-500">Use at least 8 characters, including one uppercase letter, one lowercase letter, and one number.</p>}
              </div>

              {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">{error}</p>}

              {!isSignUp && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="remember"
                    
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <label htmlFor="remember" className="text-xs font-semibold text-slate-600 cursor-pointer">
                    Remember this device for 30 days
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-sky-500/25 active:scale-95 transition-all disabled:opacity-60"
              >
                {isAuthenticating ? 'Signing in…' : isSignUp ? 'Create Account' : 'Sign In'}
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>

      </div>
      )}

    </div>
  );
}
