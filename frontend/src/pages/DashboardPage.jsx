import React, { useState } from 'react';
import { 
  Layers, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  FileCheck2, 
  Download, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Share2
} from 'lucide-react';
import { CompletenessRadar } from '../components/CompletenessRadar.jsx';
import { SourceAuthorityBadge } from '../components/SourceAuthorityBadge.jsx';

export function DashboardPage({ report, session, onExport, onNavigateToEvidence, onNavigateToChecklist }) {
  const [filterView, setFilterView] = useState('all'); // 'all' | 'gaps' | 'conflicts' | 'supported' | 'freshness'

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto text-center py-24 space-y-4">
        <Layers className="w-12 h-12 mx-auto text-slate-500 animate-pulse" />
        <h2 className="text-xl font-bold text-white">No Research Report Generated Yet</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Please open the Workspace tab, add sources or load the scholarship demo, and click "Execute Research Intelligence Pipeline".
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
    checklist = [],
    executiveSummary = {}
  } = report;

  const gaps = fields.filter(f => f.status === 'Not found in reviewed sources');
  const supported = fields.filter(f => f.status === 'Found' || f.status === 'Partially found');

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      {/* Executive Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Intelligence Brief · {objective?.domainName}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
            "{objective?.question || session?.question}"
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Synthesized at {new Date(report.meta?.generatedAt).toLocaleString()} · Pipeline Latency: {report.meta?.durationMs}ms
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold border border-slate-700 shadow-sm transition"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export Report (.MD / .JSON)</span>
          </button>
        </div>
      </div>

      {/* Executive Summary Card */}
      <div className="glass-panel rounded-2xl p-6 border border-indigo-500/30 shadow-xl bg-gradient-to-br from-navy-900/90 to-navy-950/90 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="text-base font-bold text-white">Executive Synthesis</h3>
            <p className="text-sm text-slate-300 font-medium">
              {executiveSummary.headline}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              {(executiveSummary.criticalFindings || []).map((finding, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-navy-950/70 border border-slate-800/80 text-xs text-slate-300">
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
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {[
          { id: 'all', label: 'All Findings', count: fields.length },
          { id: 'gaps', label: 'Dark Spots / Missing Gaps', count: gaps.length, color: 'text-orange-400' },
          { id: 'conflicts', label: 'Possible Contradictions', count: contradictions.length, color: 'text-rose-400' },
          { id: 'freshness', label: 'Freshness Warnings', count: freshness.warnings?.length, color: 'text-purple-400' },
          { id: 'supported', label: 'Source-Supported', count: supported.length, color: 'text-emerald-400' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterView(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
              filterView === tab.id
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] bg-navy-950 border border-slate-800 ${tab.color || 'text-slate-300'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Section 1: Potential Information Gaps ("Not found in reviewed sources") */}
      {(filterView === 'all' || filterView === 'gaps') && gaps.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-orange-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Potential Information Gaps (Digital Dark Spots)
              </h2>
            </div>
            <span className="text-xs text-orange-400 font-semibold uppercase tracking-wider">
              {gaps.length} Dark Spot{gaps.length === 1 ? '' : 's'} Detected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gaps.map(gap => (
              <div
                key={gap.fieldId}
                className="glass-card p-5 rounded-2xl border border-orange-500/30 bg-orange-950/10 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                      Not found in reviewed sources
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5">{gap.fieldName}</h3>
                  </div>
                  {gap.critical && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Critical
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {gap.gapReason}
                </p>

                <div className="p-3 rounded-xl bg-navy-950/80 border border-slate-800 text-[11px] space-y-1">
                  <div className="font-semibold text-slate-400">Missing Elements to Verify:</div>
                  <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                    {gap.missingElements?.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                  <span className="italic">Reviewed across {report.sourcesSummary?.activeCount || 0} sources</span>
                  <button
                    onClick={onNavigateToChecklist}
                    className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>View in Checklist</span>
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Context-Aware Contradictions & Procedural Discrepancies
              </h2>
            </div>
            <span className="text-xs text-rose-400 font-semibold uppercase tracking-wider">
              {contradictions.length} Conflict{contradictions.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="space-y-4">
            {contradictions.map(conf => (
              <div
                key={conf.conflictId}
                className="glass-card p-6 rounded-2xl border border-rose-500/30 bg-rose-950/10 space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Possible conflict – needs verification
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5">
                      {conf.fieldName}: {conf.conflictType}
                    </h3>
                  </div>

                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    conf.severity === 'critical' 
                      ? 'bg-rose-500/30 text-rose-200 border border-rose-500' 
                      : 'bg-amber-500/30 text-amber-200 border border-amber-500'
                  }`}>
                    {conf.severity}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {conf.explanation}
                </p>

                {/* Side-by-side comparison cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-navy-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-semibold text-indigo-400">Source A</span>
                      <span>Cycle: {conf.claimA.cycleOrDate || 'Unspecified'}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-100">{conf.claimA.value}</div>
                    <div className="text-[11px] text-slate-400 truncate">
                      Source: {conf.claimA.sourceTitle}
                    </div>
                    <blockquote className="text-[11px] text-slate-400 border-l-2 border-indigo-500 pl-2 italic">
                      "{conf.claimA.supportingText}"
                    </blockquote>
                  </div>

                  <div className="p-3.5 rounded-xl bg-navy-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-semibold text-rose-400">Source B</span>
                      <span>Cycle: {conf.claimB.cycleOrDate || 'Unspecified'}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-100">{conf.claimB.value}</div>
                    <div className="text-[11px] text-slate-400 truncate">
                      Source: {conf.claimB.sourceTitle}
                    </div>
                    <blockquote className="text-[11px] text-slate-400 border-l-2 border-rose-500 pl-2 italic">
                      "{conf.claimB.supportingText}"
                    </blockquote>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                  <span className="text-amber-300 font-medium">
                    Recommended: {conf.suggestedAction}
                  </span>
                  <button
                    onClick={onNavigateToEvidence}
                    className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold shrink-0"
                  >
                    <span>Trace Evidence</span>
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Temporal Freshness & Application Cycle Advisories
              </h2>
            </div>
            <span className="text-xs text-purple-400 font-semibold uppercase tracking-wider">
              {freshness.warnings.length} Advisory
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {freshness.warnings.map(warn => (
              <div
                key={warn.warningId}
                className="glass-card p-5 rounded-2xl border border-purple-500/30 bg-purple-950/10 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {warn.type}
                  </span>
                  <span className="text-xs text-slate-400 truncate">{warn.sourceTitle}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {warn.message}
                </p>

                <div className="p-3 rounded-xl bg-navy-950 border border-slate-800 text-[11px] text-amber-300">
                  <strong>Verification Action:</strong> {warn.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 4: Source-Supported Findings */}
      {(filterView === 'all' || filterView === 'supported') && supported.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Source-Supported Findings
              </h2>
            </div>
            <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
              {supported.length} Supported Field{supported.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supported.map(field => (
              <div
                key={field.fieldId}
                className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      field.status === 'Found'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {field.status}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5">{field.fieldName}</h3>
                  </div>
                  <span className="text-xs text-slate-400">{field.claimsCount} claim(s)</span>
                </div>

                <p className="text-xs text-slate-300">
                  {field.assessmentSummary}
                </p>

                <div className="divide-y divide-slate-800/80 bg-navy-950/70 p-3 rounded-xl border border-slate-800 text-xs">
                  {field.claims?.slice(0, 2).map(c => (
                    <div key={c.claimId} className="py-1.5 first:pt-0 last:pb-0">
                      <div className="font-semibold text-slate-200">{c.value}</div>
                      <div className="text-[11px] text-slate-400 flex items-center justify-between mt-0.5">
                        <span>Source: {c.sourceTitle}</span>
                        <span className="font-mono text-cyan-400">{c.confidence} confidence</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    onClick={onNavigateToEvidence}
                    className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>View Claims & Lineage</span>
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
