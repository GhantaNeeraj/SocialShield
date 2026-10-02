import React, { useState, useEffect } from 'react';
import { FlaskConical, Zap, ArrowRight, ShieldAlert, ShieldCheck } from 'lucide-react';
import axios from 'axios';

export default function Sandbox({ onSelectSample }) {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSamples();
  }, []);

  const fetchSamples = async () => {
    try {
      const res = await axios.get('/api/test-samples');
      setSamples(res.data);
    } catch (err) {
      console.error('Error fetching test samples:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="white-panel rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Scenario Lab</h2>
            <p className="text-xs text-slate-500 font-medium">Try example messages and links to see how the threat scanner responds.</p>
          </div>
        </div>
      </div>

      {/* Example Scenarios */}
      {loading ? (
        <div className="text-center py-12 white-panel rounded-3xl border border-slate-200 text-slate-400 font-mono text-xs">
          Loading example scenarios...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {samples.map((sample) => {
            const isHighRisk = sample.category.includes('Phishing') || sample.category.includes('Social Engineering') || sample.category.includes('Subscription');
            return (
              <div
                key={sample.id}
                className={`white-panel-interactive rounded-3xl p-6 border space-y-4 flex flex-col justify-between ${
                  isHighRisk ? 'border-rose-200 bg-gradient-to-br from-rose-50/40 via-white to-white' : 'border-emerald-200 bg-gradient-to-br from-emerald-50/40 via-white to-white'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-extrabold uppercase px-3 py-1 rounded-full border ${
                      isHighRisk ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    }`}>
                      {sample.category}
                    </span>
                    {isHighRisk ? <ShieldAlert className="w-4 h-4 text-rose-600" /> : <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight">{sample.title}</h3>

                  {sample.message && (
                    <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 font-sans font-medium leading-relaxed">
                      "{sample.message}"
                    </p>
                  )}

                  {sample.url && (
                    <p className="text-xs font-mono font-semibold text-indigo-600 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 truncate">
                      {sample.url}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => onSelectSample(sample)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-sky-500/20 active:scale-95 transition-all"
                >
                  <Zap className="w-4 h-4" /> Analyze This Example <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
