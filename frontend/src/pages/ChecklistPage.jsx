import React, { useState } from 'react';
import { 
  CheckSquare, 
  CheckCircle2, 
  Download
} from 'lucide-react';

export function ChecklistPage({ report, session, onToggleChecklist, onExport }) {
  const [filterPriority, setFilterPriority] = useState('all');

  if (!report || !report.checklist || report.checklist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20 space-y-3">
        <CheckSquare className="w-10 h-10 mx-auto text-slate-400 animate-pulse" />
        <h2 className="text-lg font-bold text-slate-900">No Verification Checklist Generated</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
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
    <div className="max-w-4xl mx-auto space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-700" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Pre-Application Verification Checklist
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Prioritized operational steps generated from detected gaps, contradictions, and cycle warnings.
          </p>
        </div>

        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-300 shadow-xs transition"
        >
          <Download className="w-3.5 h-3.5 text-blue-700" />
          <span>Export Checklist</span>
        </button>
      </div>

      {/* Progress & Priority Toolbar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase font-bold tracking-wider text-slate-500">
              Verification Progress
            </div>
            <div className="text-base font-extrabold text-slate-900 mt-0.5">
              {completedCount} of {checklist.length} Tasks Verified ({progressPct}%)
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Filter:</span>
            {['all', 'CRITICAL', 'HIGH', 'MEDIUM'].map(p => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  filterPriority === p
                    ? 'bg-blue-50 text-blue-800 border border-blue-200 shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-2.5">
        {filteredItems.map(item => {
          const isCritical = item.priority === 'CRITICAL';
          const isHigh = item.priority === 'HIGH';

          return (
            <div
              key={item.itemId}
              onClick={() => onToggleChecklist(item.itemId, !item.completed)}
              className={`bg-white p-4 rounded-xl border transition cursor-pointer select-none shadow-xs ${
                item.completed
                  ? 'border-slate-200 bg-slate-50/80 opacity-70'
                  : isCritical
                  ? 'border-rose-200 hover:border-rose-300'
                  : isHigh
                  ? 'border-amber-200 hover:border-amber-300'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Custom Checkbox */}
                <div className="mt-0.5 shrink-0">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                      item.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white hover:border-blue-500'
                    }`}
                  >
                    {item.completed && <CheckCircle2 className="w-4 h-4 fill-current text-white" />}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.2 rounded ${
                        isCritical
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : isHigh
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {item.priority}
                    </span>

                    <span className="text-xs font-semibold text-slate-500">
                      {item.category}
                    </span>
                  </div>

                  <h3
                    className={`text-sm font-bold text-slate-900 leading-snug ${
                      item.completed ? 'line-through text-slate-400' : ''
                    }`}
                  >
                    {item.task}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-800">Why this matters:</strong> {item.reason}
                  </p>

                  <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-500 border-t border-slate-100">
                    <div className="truncate">
                      <span className="text-slate-500 font-medium">Suggested Source: </span>
                      <span className="text-blue-700 font-semibold">{item.suggestedAuthoritativeSource}</span>
                    </div>

                    <span className="font-mono text-slate-400">
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
