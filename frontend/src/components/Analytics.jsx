import React, { useState, useEffect } from 'react';
import { BarChart3, MessageSquareWarning, Link2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import axios from 'axios';

export default function Analytics() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await axios.get('/api/metrics');
      setMetrics(res.data);
    } catch (err) {
      console.error('Error fetching metrics:', err);
    }
  };

  const nlpData = metrics?.nlp_model || {
    accuracy: 1.0,
    precision: 1.0,
    recall: 1.0,
    f1_score: 1.0,
    sample_count: 50,
    confusion_matrix: [[25, 0], [0, 25]]
  };

  const urlData = metrics?.url_model || {
    accuracy: 1.0,
    precision: 1.0,
    recall: 1.0,
    f1_score: 1.0,
    sample_count: 50,
    confusion_matrix: [[25, 0], [0, 25]]
  };

  const chartData = [
    { metric: 'Accuracy', Message: (nlpData.accuracy * 100).toFixed(1), Link: (urlData.accuracy * 100).toFixed(1) },
    { metric: 'Precision', Message: (nlpData.precision * 100).toFixed(1), Link: (urlData.precision * 100).toFixed(1) },
    { metric: 'Recall', Message: (nlpData.recall * 100).toFixed(1), Link: (urlData.recall * 100).toFixed(1) },
    { metric: 'F1-Score', Message: (nlpData.f1_score * 100).toFixed(1), Link: (urlData.f1_score * 100).toFixed(1) },
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="white-panel rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Detection Quality</h2>
            <p className="text-xs text-slate-500 font-medium">Evaluation indicators for message and link threat detection</p>
            <p className="mt-1 text-[11px] text-slate-400">Figures use the included sample set and are not a production accuracy guarantee.</p>
          </div>
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* NLP Model Card */}
        <div className="white-panel rounded-3xl p-6 border border-slate-200/80 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="text-xs font-bold text-sky-600 uppercase tracking-wider">MESSAGE ANALYSIS</div>
              <h3 className="text-lg font-bold text-slate-900">Suspicious Message Detection</h3>
            </div>
            <MessageSquareWarning className="w-5 h-5 text-sky-600" />
          </div>

          <p className="text-xs text-slate-500">Checks messages for language patterns commonly used in social engineering.</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-center">
              <div className="text-[11px] text-slate-500 font-bold uppercase">Accuracy</div>
              <div className="text-lg font-black text-sky-600 font-mono">{(nlpData.accuracy * 100).toFixed(1)}%</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-center">
              <div className="text-[11px] text-slate-500 font-bold uppercase">Precision</div>
              <div className="text-lg font-black text-emerald-600 font-mono">{(nlpData.precision * 100).toFixed(1)}%</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-center">
              <div className="text-[11px] text-slate-500 font-bold uppercase">Recall</div>
              <div className="text-lg font-black text-blue-600 font-mono">{(nlpData.recall * 100).toFixed(1)}%</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-center">
              <div className="text-[11px] text-slate-500 font-bold uppercase">F1-Score</div>
              <div className="text-lg font-black text-indigo-600 font-mono">{nlpData.f1_score.toFixed(2)}</div>
            </div>
          </div>

          {/* Confusion Matrix */}
          <div className="pt-2">
            <div className="text-xs font-bold text-slate-700 mb-2">Message detection results</div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono font-semibold">
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-emerald-800">
                True Negative: {nlpData.confusion_matrix[0][0]}
              </div>
              <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 text-rose-800">
                False Positive: {nlpData.confusion_matrix[0][1]}
              </div>
              <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 text-rose-800">
                False Negative: {nlpData.confusion_matrix[1][0]}
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-emerald-800">
                True Positive: {nlpData.confusion_matrix[1][1]}
              </div>
            </div>
          </div>
        </div>

        {/* URL Model Card */}
        <div className="white-panel rounded-3xl p-6 border border-slate-200/80 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">LINK ANALYSIS</div>
              <h3 className="text-lg font-bold text-slate-900">Suspicious Link Detection</h3>
            </div>
            <Link2 className="w-5 h-5 text-indigo-600" />
          </div>

          <p className="text-xs text-slate-500">Checks link structure and domain signals associated with phishing.</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-center">
              <div className="text-[11px] text-slate-500 font-bold uppercase">Accuracy</div>
              <div className="text-lg font-black text-indigo-600 font-mono">{(urlData.accuracy * 100).toFixed(1)}%</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-center">
              <div className="text-[11px] text-slate-500 font-bold uppercase">Precision</div>
              <div className="text-lg font-black text-emerald-600 font-mono">{(urlData.precision * 100).toFixed(1)}%</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-center">
              <div className="text-[11px] text-slate-500 font-bold uppercase">Recall</div>
              <div className="text-lg font-black text-blue-600 font-mono">{(urlData.recall * 100).toFixed(1)}%</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-center">
              <div className="text-[11px] text-slate-500 font-bold uppercase">F1-Score</div>
              <div className="text-lg font-black text-sky-600 font-mono">{urlData.f1_score.toFixed(2)}</div>
            </div>
          </div>

          {/* Confusion Matrix */}
          <div className="pt-2">
            <div className="text-xs font-bold text-slate-700 mb-2">Link detection results</div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono font-semibold">
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-emerald-800">
                True Negative: {urlData.confusion_matrix[0][0]}
              </div>
              <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 text-rose-800">
                False Positive: {urlData.confusion_matrix[0][1]}
              </div>
              <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 text-rose-800">
                False Negative: {urlData.confusion_matrix[1][0]}
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-emerald-800">
                True Positive: {urlData.confusion_matrix[1][1]}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Recharts Graphical Chart */}
      <div className="white-panel rounded-3xl p-6 border border-slate-200/80 space-y-4 shadow-sm">
        <h3 className="text-base font-bold text-slate-900">Message and Link Evaluation</h3>
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="metric" stroke="#64748b" tick={{ fontSize: 12, fontWeight: 600 }} />
              <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 12, fontWeight: 600 }} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
              <Bar dataKey="Message" fill="#0284c7" name="Message analysis" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Link" fill="#4f46e5" name="Link analysis" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
