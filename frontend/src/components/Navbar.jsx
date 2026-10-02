import React from 'react';
import { Scan, BarChart3, History, FlaskConical, ChevronDown, LogOut, LogIn } from 'lucide-react';
import { useState } from 'react';

export default function Navbar({ activeTab, setActiveTab, currentUser, onOpenLogin, onLogout }) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const tabs = [
    { id: 'scanner', label: 'Threat Scanner', icon: Scan },
    { id: 'analytics', label: 'Analytics & Metrics', icon: BarChart3 },
    { id: 'history', label: 'Scan History', icon: History },
    { id: 'sandbox', label: 'Scenario Lab', icon: FlaskConical },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Professional Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('scanner')}>
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all duration-300">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-sky-50 to-blue-50/50"></div>
                <div className="relative z-10 flex items-center justify-center">
                  <svg className="w-7 h-7 text-sky-600 drop-shadow-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="url(#shield-grad)" fillOpacity="0.15" />
                    <defs>
                      <linearGradient id="shield-grad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#0284c7" />
                        <stop offset="100%" stopColor="#4f46e5" />
                      </linearGradient>
                    </defs>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" stroke="#0284c7" strokeWidth="2.5" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors">
                  Social<span className="text-sky-600">Shield</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Cyber Phishing & Threat Intelligence</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-sky-700 shadow-sm border border-slate-200/80 scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile / Login Action */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="relative flex items-center gap-1">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-sky-50 border border-sky-200">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-xs font-bold text-slate-900 leading-none">{currentUser.name}</div>
                    <div className="text-[10px] text-sky-700 font-semibold">{currentUser.email || currentUser.name}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen(open => !open)}
                  title="Profile options"
                  aria-label="Open profile options"
                  aria-expanded={profileMenuOpen}
                  className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {profileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg z-50">
                    <button
                      type="button"
                      onClick={() => { setProfileMenuOpen(false); onLogout(); }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-md shadow-sky-500/20 active:scale-95 transition-all"
              >
                <LogIn className="w-4 h-4" /> Sign In / Register
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
