import React, { useState } from 'react';
import { 
  Database, 
  Trash2, 
  Eye, 
  ExternalLink, 
  Calendar, 
  Clock, 
  Hash, 
  FileText,
  X
} from 'lucide-react';
import { SourceAuthorityBadge } from '../components/SourceAuthorityBadge.jsx';

export function SourceManagerPage({ sources = [], onRemoveSource, session }) {
  const [previewSource, setPreviewSource] = useState(null);

  const govCount = sources.filter(s => (s.sourceType || '').includes('gov')).length;
  const eduCount = sources.filter(s => (s.sourceType || '').includes('institution') || (s.sourceType || '').includes('academic')).length;
  const totalBytes = sources.reduce((acc, s) => acc + (s.byteSize || 0), 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-700" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Source Registry & Cryptographic Audit</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Audit ingested policy sources, verify SHA-256 content hashes, and review clean text extractions.
          </p>
        </div>
      </div>

      {/* Summary Scorecard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xl font-extrabold text-slate-900">{sources.length}</div>
          <div className="text-xs text-slate-500 mt-0.5">Ingested Sources</div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xl font-extrabold text-emerald-700">{govCount}</div>
          <div className="text-xs text-slate-500 mt-0.5">Official Government</div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xl font-extrabold text-blue-700">{eduCount}</div>
          <div className="text-xs text-slate-500 mt-0.5">Institutional / Academic</div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xl font-extrabold text-slate-700">{Math.round(totalBytes / 1024)} KB</div>
          <div className="text-xs text-slate-500 mt-0.5">Extracted Clean Text</div>
        </div>
      </div>

      {/* Sources Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Source Registry</h3>
          <span className="text-xs text-slate-500 font-medium">{sources.length} active documents</span>
        </div>

        {sources.length === 0 ? (
          <div className="text-center py-14 text-slate-500">
            <FileText className="w-8 h-8 mx-auto text-slate-400 mb-1.5" />
            <p className="text-xs font-semibold text-slate-700">No sources registered in this research session.</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Visit the Workspace tab to add URLs or upload files.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sources.map((src) => (
              <div key={src.sourceId} className="p-4 hover:bg-slate-50/70 transition">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-slate-900">{src.title}</span>
                      <SourceAuthorityBadge category={src.sourceType} />
                      {src.demoLabel && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                          {src.demoLabel}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      {src.url ? (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-blue-700 hover:underline truncate max-w-xs font-medium"
                        >
                          <span>{src.url}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-slate-500">Direct Ingestion / Upload</span>
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

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono pt-0.5">
                      <Hash className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">SHA-256: {src.contentHash || 'n/a'}</span>
                      <span>·</span>
                      <span>{src.byteSize || 0} bytes</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setPreviewSource(src)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Text</span>
                    </button>
                    <button
                      onClick={() => onRemoveSource(src.sourceId)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-xl">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{previewSource.title}</h3>
                <span className="text-xs text-slate-500">Normalized Clean Text Extraction</span>
              </div>
              <button
                onClick={() => setPreviewSource(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto font-mono text-xs text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50 m-4 rounded-xl border border-slate-200">
              {previewSource.extractedContent || 'No extracted content found.'}
            </div>

            <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono text-[10px]">SHA-256: {previewSource.contentHash}</span>
              <button
                onClick={() => setPreviewSource(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition"
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
