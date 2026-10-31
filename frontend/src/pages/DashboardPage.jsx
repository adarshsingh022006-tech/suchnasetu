import React, { useState } from 'react';
import { 
  Layers, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldAlert, 
  Download, 
  ChevronRight,
  ShieldCheck,
  FileCheck2
} from 'lucide-react';
import { CompletenessRadar } from '../components/CompletenessRadar.jsx';

export function DashboardPage({ report, session, onExport, onNavigateToEvidence, onNavigateToChecklist }) {
  const [filterView, setFilterView] = useState('all'); // 'all' | 'gaps' | 'conflicts' | 'supported' | 'freshness'

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20 space-y-3">
        <Layers className="w-10 h-10 mx-auto text-slate-400 animate-pulse" />
        <h2 className="text-lg font-bold text-slate-900">No Research Intelligence Report Generated</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Open the Workspace tab, add sources or load the scholarship benchmark case, and click "Execute Research Intelligence Pipeline".
        </p>
      </div>
    );
  }

  const {
    objective,
    completenessMap,
    fields = [],
    contradictions = [],
    freshness = { warnings: [] },
    executiveSummary = {}
  } = report;

  const gaps = fields.filter(f => f.status === 'Not found in reviewed sources');
  const supported = fields.filter(f => f.status === 'Found' || f.status === 'Partially found');

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-6">
      {/* Executive Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700">
              Intelligence Brief · {objective?.domainName}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">
            "{objective?.question || session?.question}"
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Generated at {new Date(report.meta?.generatedAt).toLocaleString()} · Latency: {report.meta?.durationMs}ms · Mode: {report.meta?.mode}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-300 shadow-xs transition"
          >
            <Download className="w-4 h-4 text-blue-700" />
            <span>Export Brief (.MD / .JSON)</span>
          </button>
        </div>
      </div>

      {/* Executive Summary Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 flex-1">
            <h3 className="text-sm font-bold text-slate-900">Executive Research Summary</h3>
            <p className="text-xs font-medium text-slate-700 leading-relaxed">
              {executiveSummary.headline}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              {(executiveSummary.criticalFindings || []).map((finding, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-normal">
                  {finding}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Research Completeness Map */}
      <CompletenessRadar
        completenessMap={completenessMap}
        fields={fields}
        disclaimer={report.completenessDisclaimer}
      />

      {/* Interactive Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 no-scrollbar">
        {[
          { id: 'all', label: 'All Findings', count: fields.length },
          { id: 'gaps', label: 'Dark Spots / Missing Gaps', count: gaps.length, color: 'text-orange-700 bg-orange-100' },
          { id: 'conflicts', label: 'Possible Contradictions', count: contradictions.length, color: 'text-rose-700 bg-rose-100' },
          { id: 'freshness', label: 'Freshness Advisories', count: freshness.warnings?.length, color: 'text-purple-700 bg-purple-100' },
          { id: 'supported', label: 'Source-Supported', count: supported.length, color: 'text-emerald-700 bg-emerald-100' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterView(tab.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
              filterView === tab.id
                ? 'bg-blue-50 text-blue-800 border border-blue-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${tab.color || 'text-slate-600 bg-slate-100'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Section 1: Potential Information Gaps ("Not found in reviewed sources") */}
      {(filterView === 'all' || filterView === 'gaps') && gaps.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-orange-600" />
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Identified Digital Dark Spots (Omitted Policy Fields)
              </h2>
            </div>
            <span className="text-xs text-orange-800 font-bold uppercase tracking-wider">
              {gaps.length} Dark Spot{gaps.length === 1 ? '' : 's'} Flagged
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gaps.map(gap => (
              <div
                key={gap.fieldId}
                className="bg-white p-5 rounded-2xl border border-orange-200 shadow-xs space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200">
                      Not found in reviewed sources
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1.5">{gap.fieldName}</h3>
                  </div>
                  {gap.critical && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                      Critical
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {gap.gapReason}
                </p>

                <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-100 text-[11px] space-y-1">
                  <div className="font-bold text-orange-950">Missing Specifications to Clarify:</div>
                  <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                    {gap.missingElements?.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                  <span className="italic">Checked across {report.sourcesSummary?.activeCount || 0} sources</span>
                  <button
                    onClick={onNavigateToChecklist}
                    className="text-blue-700 hover:underline flex items-center gap-1 font-bold"
                  >
                    <span>Add to Checklist</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 2: Possible Contradictions */}
      {(filterView === 'all' || filterView === 'conflicts') && contradictions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Context-Aware Contradictions & Procedural Discrepancies
              </h2>
            </div>
            <span className="text-xs text-rose-800 font-bold uppercase tracking-wider">
              {contradictions.length} Conflict{contradictions.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="space-y-3">
            {contradictions.map(conf => (
              <div
                key={conf.conflictId}
                className="bg-white p-5 rounded-2xl border border-rose-200 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                      Possible conflict – needs verification
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1.5">
                      {conf.fieldName}: {conf.conflictType}
                    </h3>
                  </div>

                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    conf.severity === 'critical' 
                      ? 'bg-rose-100 text-rose-800 border border-rose-300' 
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {conf.severity}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {conf.explanation}
                </p>

                {/* Side-by-side comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                      <span className="text-blue-800 font-bold">Source A</span>
                      <span>Cycle: {conf.claimA.cycleOrDate || 'Unstated'}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900">{conf.claimA.value}</div>
                    <div className="text-[11px] text-slate-500 truncate">
                      Source: {conf.claimA.sourceTitle}
                    </div>
                    <blockquote className="text-[11px] text-slate-600 border-l-2 border-blue-600 pl-2 italic">
                      "{conf.claimA.supportingText}"
                    </blockquote>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                      <span className="text-rose-800 font-bold">Source B</span>
                      <span>Cycle: {conf.claimB.cycleOrDate || 'Unstated'}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900">{conf.claimB.value}</div>
                    <div className="text-[11px] text-slate-500 truncate">
                      Source: {conf.claimB.sourceTitle}
                    </div>
                    <blockquote className="text-[11px] text-slate-600 border-l-2 border-rose-600 pl-2 italic">
                      "{conf.claimB.supportingText}"
                    </blockquote>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 border-t border-slate-100">
                  <span className="text-amber-800 font-medium">
                    Suggested Action: {conf.suggestedAction}
                  </span>
                  <button
                    onClick={onNavigateToEvidence}
                    className="text-blue-700 hover:underline flex items-center gap-1 font-bold shrink-0"
                  >
                    <span>Inspect Claims</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 3: Freshness Intelligence */}
      {(filterView === 'all' || filterView === 'freshness') && freshness.warnings?.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Temporal Freshness & Application Cycle Advisories
              </h2>
            </div>
            <span className="text-xs text-purple-800 font-bold uppercase tracking-wider">
              {freshness.warnings.length} Advisory
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {freshness.warnings.map(warn => (
              <div
                key={warn.warningId}
                className="bg-white p-5 rounded-2xl border border-purple-200 shadow-xs space-y-2.5"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
                    {warn.type}
                  </span>
                  <span className="text-xs text-slate-500 truncate font-semibold">{warn.sourceTitle}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {warn.message}
                </p>

                <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 text-[11px] text-purple-950">
                  <strong>Verification Recommendation:</strong> {warn.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 4: Source-Supported Findings */}
      {(filterView === 'all' || filterView === 'supported') && supported.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Source-Supported Findings
              </h2>
            </div>
            <span className="text-xs text-emerald-800 font-bold uppercase tracking-wider">
              {supported.length} Supported Field{supported.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supported.map(field => (
              <div
                key={field.fieldId}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      field.status === 'Found'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {field.status}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1.5">{field.fieldName}</h3>
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">{field.claimsCount} claim(s)</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {field.assessmentSummary}
                </p>

                <div className="divide-y divide-slate-100 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  {field.claims?.slice(0, 2).map(c => (
                    <div key={c.claimId} className="py-1.5 first:pt-0 last:pb-0">
                      <div className="font-bold text-slate-800">{c.value}</div>
                      <div className="text-[11px] text-slate-500 flex items-center justify-between mt-0.5">
                        <span>Source: {c.sourceTitle}</span>
                        <span className="font-mono text-blue-700 font-semibold">{c.confidence} confidence</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    onClick={onNavigateToEvidence}
                    className="text-xs text-blue-700 hover:underline flex items-center gap-1 font-bold"
                  >
                    <span>Inspect Claims & Lineage</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
