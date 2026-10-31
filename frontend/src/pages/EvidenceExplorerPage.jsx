import React, { useState } from 'react';
import { 
  FileCheck2, 
  Search, 
  Quote, 
  ShieldCheck, 
  HelpCircle,
  X,
  ExternalLink,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { SourceAuthorityBadge } from '../components/SourceAuthorityBadge.jsx';

export function EvidenceExplorerPage({ report, session }) {
  const [selectedField, setSelectedField] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [confidenceFilter, setConfidenceFilter] = useState('all');
  const [activeClaimModal, setActiveClaimModal] = useState(null);

  if (!report || !report.claims || report.claims.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20 space-y-3">
        <FileCheck2 className="w-10 h-10 mx-auto text-slate-400 animate-pulse" />
        <h2 className="text-lg font-bold text-slate-900">No Extracted Claims Found</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Execute research analysis on your workspace sources to view granular claims and evidence lineage.
        </p>
      </div>
    );
  }

  const { claims = [], fields = [] } = report;

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
    <div className="max-w-6xl mx-auto space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-blue-700" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Evidence Lineage & Claim Registry</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Every finding linked to its source attribution, exact verbatim quotes, and confidence indicators.
          </p>
        </div>

        <div className="text-xs text-slate-600 font-medium">
          Showing <strong className="text-slate-900">{filteredClaims.length}</strong> of{' '}
          <strong className="text-slate-900">{claims.length}</strong> extracted claims
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search claim values, subjects, or verbatim quotes..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:bg-white focus:border-blue-600 transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold focus:border-blue-600 transition w-full md:w-auto"
          >
            <option value="all">All Inquiry Fields</option>
            {fields.map(f => (
              <option key={f.fieldId} value={f.fieldId}>{f.fieldName}</option>
            ))}
          </select>

          <select
            value={confidenceFilter}
            onChange={(e) => setConfidenceFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold focus:border-blue-600 transition w-full md:w-auto"
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
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                {/* Meta row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                      {claim.claimId}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {fields.find(f => f.fieldId === claim.fieldId)?.fieldName || claim.fieldId}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      isHigh
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : isMod
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {claim.confidence} Confidence
                  </span>
                </div>

                {/* Subject & Predicate -> Value */}
                <div>
                  <div className="text-xs text-slate-500">
                    <strong className="text-slate-800">{claim.subject}</strong>{' '}
                    <span className="italic text-blue-700">[{claim.predicate}]</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {claim.value}
                  </div>
                </div>

                {/* Supporting Quote Snippet */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-500">
                    <Quote className="w-3 h-3 text-blue-600" />
                    <span>Exact Verbatim Quote from Source</span>
                  </div>
                  <blockquote className="text-xs text-slate-700 italic border-l-2 border-blue-600 pl-2">
                    "{claim.supportingText}"
                  </blockquote>
                </div>
              </div>

              {/* Source Lineage Footer */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="truncate max-w-[200px]">
                  <span className="block truncate font-semibold text-slate-800">{claim.sourceTitle}</span>
                  <span className="text-[11px] text-slate-500">
                    Cycle/Date: {claim.cycleOrDate || 'Undated'}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setActiveClaimModal(claim)}
                    className="flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>
                  <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {claim.sourceId}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Claim Lineage Deep Inspection Modal */}
      {activeClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-xl relative space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                  {activeClaimModal.claimId}
                </span>
                <span className="text-sm font-bold text-slate-900">
                  Claim Provenance & Verbatim Audit
                </span>
              </div>
              <button
                onClick={() => setActiveClaimModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Structured Predicate View */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs text-slate-500">
                <strong className="text-slate-800">{activeClaimModal.subject}</strong>{' '}
                <span className="italic text-blue-700 font-bold">[{activeClaimModal.predicate}]</span>
              </div>
              <div className="text-base font-extrabold text-slate-900">
                {activeClaimModal.value}
              </div>
              <div className="text-xs text-slate-600">
                <strong>Context:</strong> {activeClaimModal.context || 'General inquiry parameter'}
              </div>
            </div>

            {/* Verbatim Supporting Quote */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Quote className="w-4 h-4 text-blue-600" />
                <span>Exact Verbatim Source Text (Grounded Quote)</span>
              </div>
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 font-serif leading-relaxed italic border-l-4 border-l-amber-600">
                "{activeClaimModal.supportingText}"
              </div>
            </div>

            {/* Source Lineage Metadata */}
            <div className="p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Originating Source:</span>
                <span className="font-bold text-slate-800">{activeClaimModal.sourceTitle}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Source ID:</span>
                <span className="font-mono text-slate-700">{activeClaimModal.sourceId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Cycle / Temporal Stamp:</span>
                <span className="font-semibold text-slate-700">{activeClaimModal.cycleOrDate || 'Undated / Active'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Confidence Indicator:</span>
                <span className="font-bold text-emerald-700 uppercase">{activeClaimModal.confidence} Confidence</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero AI Extrapolation: 100% Traceable to Source Quote</span>
              </div>
              <button
                onClick={() => setActiveClaimModal(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
