import React, { useState } from 'react';
import { 
  Database, 
  Trash2, 
  Eye, 
  ExternalLink, 
  Calendar, 
  Clock, 
  Hash, 
  Layers, 
  ShieldCheck, 
  AlertTriangle,
  FileText,
  X
} from 'lucide-react';
import { SourceAuthorityBadge } from '../components/SourceAuthorityBadge.jsx';

export function SourceManagerPage({ sources = [], onRemoveSource, session }) {
  const [previewSource, setPreviewSource] = useState(null);

  const govCount = sources.filter(s => (s.sourceType || '').includes('gov')).length;
  const eduCount = sources.filter(s => (s.sourceType || '').includes('institution') || (s.sourceType || '').includes('academic')).length;
  const webCount = sources.length - govCount - eduCount;
  const totalBytes = sources.reduce((acc, s) => acc + (s.byteSize || 0), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Source Management & Lineage</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Audit ingested documents, verify cryptographic SHA-256 signatures, and inspect clean text layers.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-navy-900/60 border border-slate-800">
          <div className="text-2xl font-bold text-white">{sources.length}</div>
          <div className="text-xs text-slate-400 mt-0.5">Total Ingested Sources</div>
        </div>
        <div className="p-4 rounded-xl bg-navy-900/60 border border-slate-800">
          <div className="text-2xl font-bold text-emerald-400">{govCount}</div>
          <div className="text-xs text-slate-400 mt-0.5">Official Government</div>
        </div>
        <div className="p-4 rounded-xl bg-navy-900/60 border border-slate-800">
          <div className="text-2xl font-bold text-blue-400">{eduCount}</div>
          <div className="text-xs text-slate-400 mt-0.5">Institutional / Academic</div>
        </div>
        <div className="p-4 rounded-xl bg-navy-900/60 border border-slate-800">
          <div className="text-2xl font-bold text-cyan-400">{Math.round(totalBytes / 1024)} KB</div>
          <div className="text-xs text-slate-400 mt-0.5">Clean Text Extracted</div>
        </div>
      </div>

      {/* Sources Table / Cards */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Ingested Source Registry</h3>
          <span className="text-xs text-slate-400">{sources.length} source records</span>
        </div>

        {sources.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <FileText className="w-10 h-10 mx-auto text-slate-400 mb-2" />
            <p className="text-sm">No sources registered in this research session.</p>
            <p className="text-xs text-slate-400 mt-1">Visit the Workspace tab to add URLs or upload files.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {sources.map((src) => (
              <div key={src.sourceId} className="p-5 hover:bg-navy-900/40 transition">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-bold text-sm text-slate-100">{src.title}</span>
                      <SourceAuthorityBadge category={src.sourceType} />
                      {src.demoLabel && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                          {src.demoLabel}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      {src.url ? (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-indigo-400 hover:underline truncate max-w-xs"
                        >
                          <span>{src.url}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-slate-400">Direct Ingestion / Upload</span>
                      )}
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        Published: {src.publishedDate || 'Undated'}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        Retrieved: {new Date(src.retrievedDate || Date.now()).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono pt-1">
                      <Hash className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">SHA-256: {src.contentHash || 'n/a'}</span>
                      <span>·</span>
                      <span>{src.byteSize || 0} bytes</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setPreviewSource(src)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Text</span>
                    </button>
                    <button
                      onClick={() => onRemoveSource(src.sourceId)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition"
                      title="Remove Source"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inspect Text Modal */}
      {previewSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
          <div className="bg-navy-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">{previewSource.title}</h3>
                <span className="text-xs text-slate-400">Extracted Clean Text Content</span>
              </div>
              <button
                onClick={() => setPreviewSource(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap bg-navy-950/60 m-4 rounded-xl border border-slate-800">
              {previewSource.extractedContent || 'No extracted content found.'}
            </div>

            <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>SHA-256: {previewSource.contentHash}</span>
              <button
                onClick={() => setPreviewSource(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
