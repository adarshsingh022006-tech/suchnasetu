import React from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle, XCircle, ShieldAlert } from 'lucide-react';

export function CompletenessRadar({ completenessMap = {}, fields = [], disclaimer = '' }) {
  const percentage = completenessMap.coveragePercentage || 0;
  const supportedCount = completenessMap.supportedCount || 0;
  const partialCount = completenessMap.partialCount || 0;
  const gapCount = completenessMap.gapCount || 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Research Completeness Map</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Systematic evidence coverage across expected inquiry dimensions
          </p>
        </div>

        {/* Coverage Meter */}
        <div className="flex items-center gap-4 bg-slate-50 px-5 py-3 rounded-xl border border-slate-200">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`${
                  percentage >= 70 ? 'text-emerald-600' : percentage >= 40 ? 'text-amber-600' : 'text-rose-600'
                } transition-all duration-1000 ease-out`}
                strokeDasharray={`${percentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute text-sm font-extrabold text-slate-900">{percentage}%</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider font-bold text-slate-500">Reviewed Coverage</div>
            <div className="text-xs font-semibold text-slate-800 mt-0.5">
              <span className="text-emerald-700 font-bold">{supportedCount}</span> Supported ·{' '}
              <span className="text-amber-700 font-bold">{partialCount}</span> Partial ·{' '}
              <span className="text-orange-700 font-bold">{gapCount}</span> Gaps
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
              className={`p-4 rounded-xl border transition-all ${
                isFound
                  ? 'bg-emerald-50/60 border-emerald-200/90 hover:border-emerald-300'
                  : isPartial
                  ? 'bg-amber-50/60 border-amber-200/90 hover:border-amber-300'
                  : isConflict
                  ? 'bg-rose-50/60 border-rose-200/90 hover:border-rose-300'
                  : 'bg-orange-50/70 border-orange-200/90 hover:border-orange-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-900">{field.fieldName}</span>
                    {field.critical && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 border border-rose-200">
                        Critical
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">{field.description}</p>
                </div>

                <div className="shrink-0 mt-0.5">
                  {isFound && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  {isPartial && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                  {isConflict && <ShieldAlert className="w-5 h-5 text-rose-600" />}
                  {isGap && <XCircle className="w-5 h-5 text-orange-600" />}
                </div>
              </div>

              {/* Status pill & score bar */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span
                  className={`font-bold ${
                    isFound
                      ? 'text-emerald-800'
                      : isPartial
                      ? 'text-amber-800'
                      : isConflict
                      ? 'text-rose-800'
                      : 'text-orange-900'
                  }`}
                >
                  {field.status}
                </span>
                <span className="text-slate-500 text-[11px] font-medium">
                  {field.claimsCount || 0} claim{field.claimsCount === 1 ? '' : 's'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mandatory Official Disclaimer */}
      <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-2.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
        <HelpCircle className="w-4 h-4 text-blue-700 shrink-0" />
        <span>
          <strong className="text-slate-800 font-bold">Epistemic Scope:</strong>{' '}
          {disclaimer || 'Completeness reflects reviewed sources only. Absence in reviewed sources does not imply absence in unreviewed regulations.'}
        </span>
      </div>
    </div>
  );
}
