import React from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle, XCircle, ShieldAlert } from 'lucide-react';

export function CompletenessRadar({ completenessMap = {}, fields = [], disclaimer = '' }) {
  const percentage = completenessMap.coveragePercentage || 0;
  const supportedCount = completenessMap.supportedCount || 0;
  const partialCount = completenessMap.partialCount || 0;
  const gapCount = completenessMap.gapCount || 0;
  const totalFields = completenessMap.totalFields || fields.length;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="text-lg font-bold text-white tracking-tight">Research Completeness Map</h3>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Systematic evidence coverage across expected inquiry dimensions
          </p>
        </div>

        {/* Coverage Meter */}
        <div className="flex items-center gap-4 bg-navy-900/90 px-5 py-3 rounded-xl border border-slate-800">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`${
                  percentage >= 70 ? 'text-emerald-500' : percentage >= 40 ? 'text-amber-500' : 'text-rose-500'
                } transition-all duration-1000 ease-out`}
                strokeDasharray={`${percentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute text-sm font-bold text-white">{percentage}%</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">Reviewed Coverage</div>
            <div className="text-sm font-medium text-slate-200 mt-0.5">
              <span className="text-emerald-400 font-semibold">{supportedCount}</span> Supported ·{' '}
              <span className="text-amber-400 font-semibold">{partialCount}</span> Partial ·{' '}
              <span className="text-rose-400 font-semibold">{gapCount}</span> Gaps
            </div>
          </div>
        </div>
      </div>

      {/* Field Status Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-6">
        {fields.map(field => {
          const isFound = field.status === 'Found';
          const isPartial = field.status === 'Partially found';
          const isConflict = field.status === 'Conflicting evidence';
          const isGap = field.status === 'Not found in reviewed sources';

          return (
            <div
              key={field.fieldId}
              className={`p-3.5 rounded-xl border transition-all ${
                isFound
                  ? 'bg-emerald-950/20 border-emerald-800/40 hover:border-emerald-700/60'
                  : isPartial
                  ? 'bg-amber-950/20 border-amber-800/40 hover:border-amber-700/60'
                  : isConflict
                  ? 'bg-rose-950/20 border-rose-800/40 hover:border-rose-700/60'
                  : 'bg-orange-950/20 border-orange-800/50 hover:border-orange-700/70'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-slate-200">{field.fieldName}</span>
                    {field.critical && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Critical
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{field.description}</p>
                </div>

                <div className="shrink-0 mt-0.5">
                  {isFound && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  {isPartial && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                  {isConflict && <ShieldAlert className="w-5 h-5 text-rose-400" />}
                  {isGap && <XCircle className="w-5 h-5 text-orange-400" />}
                </div>
              </div>

              {/* Status pill & score bar */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span
                  className={`font-medium ${
                    isFound
                      ? 'text-emerald-400'
                      : isPartial
                      ? 'text-amber-400'
                      : isConflict
                      ? 'text-rose-400 font-semibold'
                      : 'text-orange-400 font-semibold'
                  }`}
                >
                  {field.status}
                </span>
                <span className="text-slate-400 text-[11px]">
                  {field.claimsCount || 0} claim{field.claimsCount === 1 ? '' : 's'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mandatory Official Disclaimer */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2.5 text-xs text-slate-400 bg-navy-900/60 p-3 rounded-lg border border-slate-800/60">
        <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>
          <strong className="text-slate-300 font-semibold">Epistemic Scope:</strong>{' '}
          {disclaimer || 'Completeness reflects reviewed sources only. Absence in reviewed sources does not imply absence in unreviewed regulations.'}
        </span>
      </div>
    </div>
  );
}
