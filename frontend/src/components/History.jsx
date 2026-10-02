import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, Search, Trash2, ShieldAlert, ShieldCheck, AlertTriangle, X } from 'lucide-react';
import axios from 'axios';

export default function History() {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [activeModalItem, setActiveModalItem] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, [selectedFilter]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/history', {
        params: {
          q: searchQuery,
          level: selectedFilter
        }
      });
      setHistoryItems(res.data);
    } catch (err) {
      console.error('Error fetching scan history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHistory();
  };

  const handleDeleteItem = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`/api/history/${id}`);
      setHistoryItems(historyItems.filter(item => (item.id || item._id) !== id));
    } catch (err) {
      console.error('Error deleting scan item:', err);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all scan history?')) return;
    try {
      await axios.delete('/api/history');
      setHistoryItems([]);
    } catch (err) {
      console.error('Error clearing history:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="white-panel rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600">
            <HistoryIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Scan History & Threat Intelligence Logs</h2>
            <p className="text-xs text-slate-500 font-medium">Review past security scans, threat scores, and detailed NLP indicators</p>
          </div>
        </div>

        {historyItems.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-all"
          >
            <Trash2 className="w-4 h-4" /> Clear History
          </button>
        )}
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="w-full md:w-96 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search history by message or URL..."
            className="w-full rounded-2xl bg-white border border-slate-200 pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 shadow-2xs font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'HIGH RISK', 'MODERATE RISK', 'LOW RISK'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedFilter(lvl)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                selectedFilter === lvl
                  ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-500/20'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Scan Log Items */}
      {loading ? (
        <div className="text-center py-16 white-panel rounded-3xl border border-slate-200 text-slate-500 font-mono text-sm font-medium">
          Loading scan records...
        </div>
      ) : historyItems.length === 0 ? (
        <div className="text-center py-16 white-panel rounded-3xl border border-slate-200 text-slate-500 font-mono text-sm font-medium">
          No scan records found matching filter criteria.
        </div>
      ) : (
        <div className="space-y-4">
          {historyItems.map((item) => {
            const itemId = item.id || item._id;
            return (
              <div
                key={itemId}
                onClick={() => setActiveModalItem(item)}
                className="white-panel-interactive rounded-3xl p-5 border border-slate-200/80 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase border ${
                      item.risk_level === 'HIGH RISK'
                        ? 'bg-rose-100 text-rose-800 border-rose-200'
                        : item.risk_level === 'MODERATE RISK'
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    }`}>
                      {item.risk_level === 'HIGH RISK' ? (
                        <ShieldAlert className="w-3.5 h-3.5" />
                      ) : item.risk_level === 'MODERATE RISK' ? (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5" />
                      )}
                      {item.risk_level} ({item.overall_risk}/100)
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono font-medium">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {item.message && (
                    <p className="text-xs text-slate-800 line-clamp-2 font-sans font-medium leading-relaxed">
                      <strong className="text-slate-400 font-semibold">Msg:</strong> "{item.message}"
                    </p>
                  )}

                  {item.url && (
                    <p className="text-xs text-indigo-600 font-mono truncate max-w-xl font-semibold">
                      <strong className="text-slate-400 font-sans font-semibold">URL:</strong> {item.url}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <button
                    onClick={(e) => handleDeleteItem(itemId, e)}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-700 border border-slate-200/80 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Detail View */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="white-panel rounded-3xl max-w-2xl w-full p-6 border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Scan Detail Log</h3>
              <button onClick={() => setActiveModalItem(null)} className="p-1 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-slate-500 font-bold">Overall Risk Score</span>
                <span className="font-mono text-lg font-black text-sky-600">{activeModalItem.overall_risk}/100</span>
              </div>

              {activeModalItem.message && (
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div className="text-slate-500 font-bold mb-1">Scanned Message</div>
                  <p className="text-slate-800 font-medium leading-relaxed">{activeModalItem.message}</p>
                </div>
              )}

              {activeModalItem.url && (
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div className="text-slate-500 font-bold mb-1">Scanned URL</div>
                  <p className="font-mono text-indigo-600 font-semibold">{activeModalItem.url}</p>
                </div>
              )}

              {activeModalItem.recommendations && (
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div className="text-slate-500 font-bold mb-1">Recommendations</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 font-medium">
                    {activeModalItem.recommendations.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
