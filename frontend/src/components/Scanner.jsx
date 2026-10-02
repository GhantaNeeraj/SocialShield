import React, { useState } from 'react';
import { 
  ShieldAlert, ShieldCheck, AlertTriangle, Search, Sparkles, Trash2, 
  Copy, Check, ExternalLink, MessageSquare, Link2, Shield, Info, CornerDownRight, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Scanner({ onAnalyze, result, loading, onClear }) {
  const [message, setMessage] = useState('');
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() && !url.trim()) return;
    onAnalyze({ message, url });
  };

  const handleClearAll = () => {
    setMessage('');
    setUrl('');
    onClear();
  };

  const handleCopyReport = () => {
    if (!result) return;
    const reportText = `🛡️ SocialShield AI Threat Report
Overall Risk: ${result.overall_risk}/100 [${result.risk_level}]
Message Risk: ${result.msg_risk !== null ? result.msg_risk + '/100' : 'N/A'}
URL Risk: ${result.url_risk !== null ? result.url_risk + '/100' : 'N/A'}

Recommendations:
${result.recommendations?.join('\n')}`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getGaugeColor = (score) => {
    if (score >= 70) return '#e11d48'; // Rose Red
    if (score >= 36) return '#d97706'; // Amber
    return '#059669'; // Emerald
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner Hero */}
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-10 white-panel border border-slate-200/80 shadow-xl shadow-sky-100/50 bg-gradient-to-br from-white via-sky-50/40 to-slate-50">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-sky-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200/80 text-sky-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" /> Advanced NLP & Machine Learning Protection Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Detect Cyber Threats <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">Before You Click</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
            Paste suspicious emails, SMS lures, or questionable website URLs below. Our dual NLP & URL ML Engine will analyze language tactics and domain structures to give you an immediate, explainable security evaluation.
          </p>
        </div>
      </div>

      {/* Input Scanner Form */}
      <div className="white-panel rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl shadow-slate-200/40">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Text Message Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <MessageSquare className="w-4 h-4 text-sky-600" />
                Paste Suspicious Message
              </label>
              <span className="text-xs text-slate-400 font-mono">SMS, Email, or Chat Lure</span>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="e.g. 'URGENT: Your bank account has been locked due to suspicious activity. Verify your password immediately at http://secure-login.com or your funds will be frozen...'"
              className="w-full rounded-2xl bg-slate-50/80 border border-slate-200 p-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all font-sans leading-relaxed resize-none shadow-inner"
            />
          </div>

          {/* URL Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <Link2 className="w-4 h-4 text-indigo-600" />
                Paste Suspicious URL
              </label>
              <span className="text-xs text-slate-400 font-mono">HTTP / HTTPS Link</span>
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://paypa1-security-verify-account.com/login.php"
              className="w-full rounded-2xl bg-slate-50/80 border border-slate-200 px-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all font-mono shadow-inner"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-600 text-xs font-semibold transition-all"
            >
              <Trash2 className="w-4 h-4" /> Clear Inputs
            </button>

            <button
              type="submit"
              disabled={loading || (!message.trim() && !url.trim())}
              className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl font-bold text-sm tracking-wide text-white transition-all duration-300 shadow-lg ${
                loading || (!message.trim() && !url.trim())
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 shadow-sky-500/25 active:scale-95'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing Threat Vectors...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" /> ANALYZE THREAT NOW
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* Analysis Result Section */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Overall Risk Score Card */}
            <div className={`white-panel rounded-3xl p-6 sm:p-8 border relative overflow-hidden shadow-xl ${
              result.overall_risk >= 70
                ? 'border-rose-300 bg-gradient-to-br from-rose-50/60 via-white to-white'
                : result.overall_risk >= 36
                ? 'border-amber-300 bg-gradient-to-br from-amber-50/60 via-white to-white'
                : 'border-emerald-300 bg-gradient-to-br from-emerald-50/60 via-white to-white'
            }`}>
              
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                
                {/* Speedometer Gauge */}
                <div className="relative flex flex-col items-center justify-center shrink-0">
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        className="text-slate-100"
                        strokeWidth="9"
                        stroke="currentColor"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke={getGaugeColor(result.overall_risk)}
                        strokeWidth="9"
                        strokeDasharray={264}
                        strokeDashoffset={264 - (264 * result.overall_risk) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-4xl font-black tracking-tight text-slate-900 font-mono">
                        {result.overall_risk}
                      </span>
                      <span className="text-xs font-bold text-slate-500 font-mono">/ 100 RISK</span>
                    </div>
                  </div>
                </div>

                {/* Risk Level Badge & Details */}
                <div className="flex-1 space-y-3 text-center lg:text-left">
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider uppercase border shadow-sm ${
                      result.overall_risk >= 70
                        ? 'bg-rose-100 text-rose-700 border-rose-200'
                        : result.overall_risk >= 36
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    }`}>
                      {result.overall_risk >= 70 ? (
                        <ShieldAlert className="w-4 h-4 text-rose-600 animate-bounce" />
                      ) : result.overall_risk >= 36 ? (
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                      ) : (
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      )}
                      {result.risk_level}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      Combined Risk Engine Score
                    </span>
                  </div>

                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {result.overall_risk >= 70
                      ? 'High Risk Threat Detected'
                      : result.overall_risk >= 36
                      ? 'Suspicious Activity Warning'
                      : 'Low Risk — Communication Appears Safe'}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed max-w-2xl font-medium">
                    {result.overall_risk >= 70
                      ? 'Critical alert: Multiple social engineering lures and phishing indicators were identified. Do not click links or disclose personal information.'
                      : result.overall_risk >= 36
                      ? 'Caution: Unverified pattern matches or suspicious domain attributes were detected. Exercise care before trusting.'
                      : 'No malicious patterns or social engineering indicators were triggered in this scan.'}
                  </p>

                  <div className="flex items-center justify-center lg:justify-start gap-3 pt-2">
                    <button
                      onClick={handleCopyReport}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white shadow-md transition-all"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Report Copied!' : 'Copy Threat Report'}
                    </button>
                  </div>
                </div>

              </div>

              {/* Sub-score comparison bars */}
              <div className="mt-8 pt-6 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Social Engineering Score */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5 text-sky-600" /> Social Engineering NLP</span>
                    <span className="font-mono text-sky-700 font-black">{result.msg_risk !== null ? `${result.msg_risk}/100` : 'N/A'}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-sky-500 to-blue-600"
                      style={{ width: `${result.msg_risk || 0}%` }}
                    />
                  </div>
                </div>

                {/* Phishing URL Score */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5"><Link2 className="w-3.5 h-3.5 text-indigo-600" /> Phishing URL ML Engine</span>
                    <span className="font-mono text-indigo-700 font-black">{result.url_risk !== null ? `${result.url_risk}/100` : 'N/A'}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-indigo-500 to-purple-600"
                      style={{ width: `${result.url_risk || 0}%` }}
                    />
                  </div>
                </div>

              </div>

            </div>

            {/* Detailed Findings Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Message NLP Threat Indicators */}
              <div className="white-panel rounded-3xl p-6 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-sky-600" /> Social Engineering Indicators
                  </h4>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {result.msg_highlights?.length || 0} Matches
                  </span>
                </div>

                {result.msg_highlights && result.msg_highlights.length > 0 ? (
                  <div className="space-y-3">
                    {result.msg_highlights.map((item, idx) => (
                      <div key={idx} className="bg-rose-50/60 rounded-2xl p-4 border border-rose-200/80 flex items-start gap-3">
                        <ShieldAlert className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-xs font-extrabold text-rose-900 uppercase tracking-wider">{item.category}</div>
                          {item.evidence && item.evidence.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {item.evidence.map((ev, i) => (
                                <span key={i} className="text-[11px] font-mono px-2 py-0.5 rounded bg-white text-rose-700 border border-rose-200 font-semibold shadow-2xs">
                                  "{ev}"
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-500 text-xs font-medium">
                    ✓ No social engineering threat patterns detected in message text.
                  </div>
                )}
              </div>

              {/* URL Structural Reasons */}
              <div className="white-panel rounded-3xl p-6 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-indigo-600" /> Phishing URL Indicators
                  </h4>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {result.url_reasons?.length || 0} Anomalies
                  </span>
                </div>

                {result.url_reasons && result.url_reasons.length > 0 ? (
                  <div className="space-y-3">
                    {result.url_reasons.map((reason, idx) => (
                      <div key={idx} className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/80 flex items-start gap-3">
                        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">{reason.title}</div>
                          <p className="text-xs text-amber-800/90 mt-0.5 font-medium">{reason.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-500 text-xs font-medium">
                    ✓ URL structure matches standard domain security guidelines.
                  </div>
                )}
              </div>

            </div>

            {/* Explainable Security Recommendations */}
            <div className="white-panel rounded-3xl p-6 border border-sky-200/80 bg-gradient-to-r from-sky-50/60 via-white to-white space-y-4 shadow-md">
              <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-sky-600" /> Actionable Security Recommendations
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.recommendations?.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 text-xs text-slate-800 font-semibold shadow-2xs">
                    <CornerDownRight className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
