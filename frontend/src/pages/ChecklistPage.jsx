import React, { useState } from 'react';
import { 
  CheckSquare, 
  AlertCircle, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink, 
  Download, 
  Printer,
  ChevronRight,
  Filter
} from 'lucide-react';

export function ChecklistPage({ report, session, onToggleChecklist, onExport }) {
  const [filterPriority, setFilterPriority] = useState('all');

  if (!report || !report.checklist || report.checklist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-24 space-y-4">
        <CheckSquare className="w-12 h-12 mx-auto text-slate-500 animate-pulse" />
        <h2 className="text-xl font-bold text-white">No Verification Checklist Generated</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Execute research analysis on your workspace sources to generate a prioritized pre-application verification checklist.
        </p>
      </div>
    );
  }

  const { checklist = [] } = report;
  const completedCount = checklist.filter(c => c.completed).length;
  const progressPct = Math.round((completedCount / checklist.length) * 100);

  const filteredItems = checklist.filter(item => {
    if (filterPriority === 'all') return true;
    return item.priority === filterPriority;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Pre-Application Verification Checklist
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Prioritized operational steps generated from detected gaps, contradictions, and cycle warnings.
          </p>
        </div>

        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export Checklist</span>
        </button>
      </div>

      {/* Progress & Priority Toolbar */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-slate-400">
              Checklist Completion Progress
            </div>
            <div className="text-lg font-extrabold text-white mt-0.5">
              {completedCount} of {checklist.length} Tasks Verified ({progressPct}%)
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Filter Priority:</span>
            {['all', 'CRITICAL', 'HIGH', 'MEDIUM'].map(p => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  filterPriority === p
                    ? 'bg-indigo-600 text-white'
                    : 'bg-navy-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-navy-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-3">
        {filteredItems.map(item => {
          const isCritical = item.priority === 'CRITICAL';
          const isHigh = item.priority === 'HIGH';

          return (
            <div
              key={item.itemId}
              onClick={() => onToggleChecklist(item.itemId, !item.completed)}
              className={`glass-card p-5 rounded-2xl border transition cursor-pointer select-none ${
                item.completed
                  ? 'border-slate-800 bg-navy-950/40 opacity-75'
                  : isCritical
                  ? 'border-rose-500/40 hover:border-rose-500/70 bg-rose-950/10'
                  : isHigh
                  ? 'border-amber-500/40 hover:border-amber-500/70 bg-amber-950/10'
                  : 'border-slate-800 hover:border-slate-700 bg-navy-900/40'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Custom Checkbox */}
                <div className="mt-0.5 shrink-0">
                  <div
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition ${
                      item.completed
                        ? 'bg-emerald-500 border-emerald-400 text-white'
                        : 'border-slate-600 bg-navy-950 hover:border-indigo-400'
                    }`}
                  >
                    {item.completed && <CheckCircle2 className="w-4 h-4 fill-current text-white" />}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        isCritical
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : isHigh
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      }`}
                    >
                      {item.priority}
                    </span>

                    <span className="text-xs font-semibold text-slate-400">
                      {item.category}
                    </span>
                  </div>

                  <h3
                    className={`text-sm sm:text-base font-bold text-white leading-snug ${
                      item.completed ? 'line-through text-slate-400' : ''
                    }`}
                  >
                    {item.task}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-slate-400">Why this matters:</strong> {item.reason}
                  </p>

                  <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 border-t border-slate-800/80">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-medium truncate">
                      <span className="text-slate-400">Suggested Action Source:</span>
                      <span className="truncate">{item.suggestedAuthoritativeSource}</span>
                    </div>

                    <span className="text-[11px] text-slate-400 font-mono">
                      {item.itemId}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
