import React, { useState } from 'react';
import { 
  FileCheck2, 
  Search, 
  Filter, 
  Quote, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { SourceAuthorityBadge } from '../components/SourceAuthorityBadge.jsx';

export function EvidenceExplorerPage({ report, session }) {
  const [selectedField, setSelectedField] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [confidenceFilter, setConfidenceFilter] = useState('all');

  if (!report || !report.claims || report.claims.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-24 space-y-4">
        <FileCheck2 className="w-12 h-12 mx-auto text-slate-500 animate-pulse" />
        <h2 className="text-xl font-bold text-white">No Extracted Claims Found</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Execute research analysis on your workspace sources to view granular claims and evidence lineage.
        </p>
      </div>
    );
  }

  const { claims = [], fields = [], sourcesSummary = {} } = report;

  // Filter claims
  const filteredClaims = claims.filter(c => {
    if (selectedField !== 'all' && c.fieldId !== selectedField) return false;
    if (confidenceFilter !== 'all' && c.confidence !== confidenceFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = (c.subject || '').toLowerCase().includes(q) ||
                    (c.value || '').toLowerCase().includes(q) ||
                    (c.supportingText || '').toLowerCase().includes(q) ||
                    (c.sourceTitle || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Evidence Explorer & Claim Lineage</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Every finding linked to its source attribution, exact verbatim quotes, and confidence scores.
          </p>
        </div>

        <div className="text-xs text-slate-400">
          Showing <strong className="text-white">{filteredClaims.length}</strong> of{' '}
          <strong className="text-white">{claims.length}</strong> extracted claims
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search claim values, subjects, or supporting quotes..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-navy-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:border-indigo-500 transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            className="px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-slate-200 text-xs focus:border-indigo-500 transition w-full md:w-auto"
          >
            <option value="all">All Inquiry Fields</option>
            {fields.map(f => (
              <option key={f.fieldId} value={f.fieldId}>{f.fieldName}</option>
            ))}
          </select>

          <select
            value={confidenceFilter}
            onChange={(e) => setConfidenceFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-slate-200 text-xs focus:border-indigo-500 transition w-full md:w-auto"
          >
            <option value="all">All Confidence</option>
            <option value="high">High Confidence</option>
            <option value="moderate">Moderate Confidence</option>
            <option value="low">Low Confidence</option>
          </select>
        </div>
      </div>

      {/* Claims Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClaims.map((claim) => {
          const isHigh = claim.confidence === 'high';
          const isMod = claim.confidence === 'moderate';

          return (
            <div
              key={claim.claimId}
              className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition space-y-3.5 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                {/* Meta row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      {claim.claimId}
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                      {fields.find(f => f.fieldId === claim.fieldId)?.fieldName || claim.fieldId}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      isHigh
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : isMod
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {claim.confidence} Confidence
                  </span>
                </div>

                {/* Subject & Predicate -> Value */}
                <div>
                  <div className="text-xs text-slate-400">
                    <strong className="text-slate-300">{claim.subject}</strong>{' '}
                    <span className="italic text-indigo-400">[{claim.predicate}]</span>
                  </div>
                  <div className="text-sm font-bold text-white mt-1">
                    {claim.value}
                  </div>
                </div>

                {/* Supporting Quote Snippet */}
                <div className="p-3 rounded-xl bg-navy-950/80 border border-slate-800/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-semibold text-slate-400">
                    <Quote className="w-3 h-3 text-cyan-400" />
                    <span>Exact Verbatim Quote from Source</span>
                  </div>
                  <blockquote className="text-xs text-slate-300 italic border-l-2 border-cyan-500 pl-2">
                    "{claim.supportingText}"
                  </blockquote>
                </div>
              </div>

              {/* Source Lineage Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="truncate max-w-[240px]">
                  <span className="block truncate font-medium text-slate-300">{claim.sourceTitle}</span>
                  <span className="text-[11px] text-slate-400">
                    Cycle/Date: {claim.cycleOrDate || 'Undated'}
                  </span>
                </div>

                <div className="shrink-0">
                  <span className="font-mono text-[10px] text-slate-400 bg-navy-950 px-2 py-1 rounded border border-slate-800">
                    {claim.sourceId}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
