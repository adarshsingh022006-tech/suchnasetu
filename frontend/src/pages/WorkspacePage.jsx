import React, { useState } from 'react';
import { 
  Search, 
  Globe, 
  FileText, 
  UploadCloud, 
  Plus, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Shield,
  Trash2,
  FileCheck2,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { SourceAuthorityBadge } from '../components/SourceAuthorityBadge.jsx';

export function WorkspacePage({
  session,
  sources = [],
  question,
  setQuestion,
  domain,
  setDomain,
  onAddUrl,
  onAddText,
  onUploadPdf,
  onRemoveSource,
  onRunAnalysis,
  onLoadDemo,
  isAnalyzing,
  analysisStep
}) {
  const [activeInputTab, setActiveInputTab] = useState('url'); // 'url' | 'text' | 'pdf'
  const [inputUrl, setInputUrl] = useState('');
  const [inputTitle, setInputTitle] = useState('');
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmittingSource, setIsSubmittingSource] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    if (!inputUrl) return;
    setIsSubmittingSource(true);
    setFeedback({ type: '', message: '' });
    try {
      await onAddUrl(inputUrl);
      setInputUrl('');
      setFeedback({ type: 'success', message: 'URL successfully scraped and added to research session.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to scrape URL.' });
    } finally {
      setIsSubmittingSource(false);
    }
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!inputText || inputText.length < 20) {
      setFeedback({ type: 'error', message: 'Text must be at least 20 characters long.' });
      return;
    }
    setIsSubmittingSource(true);
    setFeedback({ type: '', message: '' });
    try {
      await onAddText({ title: inputTitle || 'Manual Evidence Excerpt', text: inputText });
      setInputText('');
      setInputTitle('');
      setFeedback({ type: 'success', message: 'Text evidence successfully added.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to add text.' });
    } finally {
      setIsSubmittingSource(false);
    }
  };

  const handlePdfSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    setIsSubmittingSource(true);
    setFeedback({ type: '', message: '' });
    try {
      await onUploadPdf(selectedFile);
      setSelectedFile(null);
      setFeedback({ type: 'success', message: 'PDF parsed and text layers extracted.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to process PDF.' });
    } finally {
      setIsSubmittingSource(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Research Workspace</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Define your inquiry, gather evidence from URLs, PDFs, or raw text, and run the 9-step intelligence engine.
          </p>
        </div>

        <button
          onClick={onLoadDemo}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-850 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold shadow-sm transition"
        >
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>Load Official Scholarship Case</span>
        </button>
      </div>

      {/* Inquiry & Domain Config */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
        <div>
          <label className="block text-xs uppercase font-bold tracking-wider text-slate-300 mb-2">
            Research Question / Inquiry
          </label>
          <div className="relative">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., What should I verify before applying for this scholarship?"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-navy-950 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder-slate-500 text-sm font-medium transition"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-slate-300 mb-2">
              Research Domain Schema
            </label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-slate-200 text-sm focus:border-indigo-500 transition"
            >
              <option value="scholarship">Scholarship & Academic Grants (Hackathon Primary)</option>
              <option value="clinical_health">Medical & Clinical Guidelines</option>
              <option value="policy_legal">Regulatory & Policy Compliance</option>
              <option value="general">General Evidence Investigation</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-navy-950/80 p-2.5 rounded-xl border border-slate-800">
              <Shield className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>SSRF Guard active: Loopback and RFC 1918 private subnets blocked.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Source Ingestion Tabs */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Add Evidence Source</h3>
            <span className="text-xs text-slate-400">({sources.length} active sources in workspace)</span>
          </div>

          <div className="flex rounded-lg bg-navy-950 p-1 border border-slate-800">
            <button
              onClick={() => setActiveInputTab('url')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                activeInputTab === 'url' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Web URL
            </button>
            <button
              onClick={() => setActiveInputTab('text')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                activeInputTab === 'text' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Paste Text
            </button>
            <button
              onClick={() => setActiveInputTab('pdf')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                activeInputTab === 'pdf' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              Upload PDF
            </button>
          </div>
        </div>

        {/* Tab 1: Web URL */}
        {activeInputTab === 'url' && (
          <form onSubmit={handleUrlSubmit} className="mt-5 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                required
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://example-scholarship-portal.gov.in/notice-2025"
                className="flex-1 px-4 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-indigo-500 transition"
              />
              <button
                type="submit"
                disabled={isSubmittingSource || !inputUrl}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition disabled:opacity-50"
              >
                {isSubmittingSource ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Scraping...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Scrape & Ingest</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Cheerio extractor extracts main text while stripping navigation, cookie banners, advertisements, and footers.
            </p>
          </form>
        )}

        {/* Tab 2: Paste Text */}
        {activeInputTab === 'text' && (
          <form onSubmit={handleTextSubmit} className="mt-5 space-y-4">
            <input
              type="text"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              placeholder="Source Title / Label (e.g. Official Circular No. 42)"
              className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-indigo-500 transition"
            />
            <textarea
              rows={4}
              required
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste article text, circular excerpt, or policy terms here..."
              className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-indigo-500 transition"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingSource || !inputText}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>Add Evidence Text</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Upload PDF */}
        {activeInputTab === 'pdf' && (
          <form onSubmit={handlePdfSubmit} className="mt-5 space-y-4">
            <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-6 text-center transition cursor-pointer bg-navy-950/50">
              <input
                type="file"
                accept=".pdf,application/pdf"
                id="pdf-upload"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <label htmlFor="pdf-upload" className="cursor-pointer block">
                <UploadCloud className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                {selectedFile ? (
                  <div>
                    <span className="text-sm font-semibold text-slate-200">{selectedFile.name}</span>
                    <span className="text-xs text-slate-400 block mt-1">
                      ({Math.round(selectedFile.size / 1024)} KB) - Click to change
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="text-sm font-semibold text-slate-300">Click to upload official PDF</span>
                    <span className="text-xs text-slate-400 block mt-1">Up to 10MB · Extracted via server-side pdf-parse</span>
                  </div>
                )}
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingSource || !selectedFile}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>Extract PDF Text</span>
              </button>
            </div>
          </form>
        )}

        {/* Feedback Message */}
        {feedback.message && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
              feedback.type === 'error'
                ? 'bg-rose-950/40 text-rose-300 border border-rose-800/60'
                : 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/60'
            }`}
          >
            {feedback.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
        )}
      </div>

      {/* Active Workspace Sources List Preview */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Active Sources in Session</h3>
            <span className="px-2 py-0.5 rounded-full text-xs bg-slate-800 text-slate-300 font-mono">
              {sources.length}
            </span>
          </div>
        </div>

        {sources.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <FileCheck2 className="w-10 h-10 mx-auto text-slate-400 mb-2" />
            <p className="text-sm">No sources added to workspace yet.</p>
            <p className="text-xs text-slate-400 mt-1">
              Add a URL, paste text, upload a PDF, or click "Load Official Scholarship Case" above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60 mt-2">
            {sources.map((src, idx) => (
              <div key={src.sourceId || idx} className="py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-sm font-semibold text-slate-200 truncate">{src.title}</span>
                    <SourceAuthorityBadge category={src.sourceType} />
                    {src.demoLabel && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {src.demoLabel}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-3 mt-1 truncate">
                    <span>{src.domain || 'Direct Text'}</span>
                    <span>·</span>
                    <span>{src.publishedDate ? `Published: ${src.publishedDate}` : 'Undated'}</span>
                    <span>·</span>
                    <span className="font-mono text-[10px] text-slate-400">
                      SHA: {src.contentHash ? src.contentHash.slice(0, 10) : 'n/a'}...
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveSource(src.sourceId)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition shrink-0"
                  title="Remove Source"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Run Analysis CTA */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-400">
          The 9-step engine will extract structured claims, detect missing fields, evaluate contradictions, and generate a checklist.
        </p>

        <button
          onClick={onRunAnalysis}
          disabled={isAnalyzing || sources.length === 0}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{analysisStep || 'Analyzing Research...'}</span>
            </>
          ) : (
            <>
              <Layers className="w-4 h-4" />
              <span>Execute Research Intelligence Pipeline</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
