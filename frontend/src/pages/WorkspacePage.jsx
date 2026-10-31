import React, { useState } from 'react';
import { 
  Search, 
  Globe, 
  FileText, 
  UploadCloud, 
  Plus, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Shield,
  Trash2,
  FileCheck2,
  Cpu,
  RefreshCw,
  Download,
  BookOpen
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
  onOpenGuide,
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
      setFeedback({ type: 'success', message: 'URL successfully scraped and ingested.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to scrape URL.' });
    } finally {
      setIsSubmittingSource(false);
    }
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!inputText || inputText.length < 20) {
      setFeedback({ type: 'error', message: 'Text excerpt must be at least 20 characters.' });
      return;
    }
    setIsSubmittingSource(true);
    setFeedback({ type: '', message: '' });
    try {
      await onAddText({ title: inputTitle || 'Manual Evidence Excerpt', text: inputText });
      setInputText('');
      setInputTitle('');
      setFeedback({ type: 'success', message: 'Text evidence added.' });
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
      setFeedback({ type: 'success', message: 'PDF document parsed and text layers ingested.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to process PDF.' });
    } finally {
      setIsSubmittingSource(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-6">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-700" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Research Workspace</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Specify the research inquiry, assemble sources (URLs, PDFs, circular text), and execute the 9-step analysis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-700" />
            <span>Workflow Guide</span>
          </button>
        </div>
      </div>

      {/* Inquiry & Domain Config */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div>
          <label className="block text-xs uppercase font-bold tracking-wider text-slate-700 mb-1.5">
            Research Inquiry / Question
          </label>
          <div className="relative">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., What should I verify before applying for this scholarship?"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 placeholder-slate-400 text-sm font-semibold transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

          <div className="flex items-center gap-2 mt-2 flex-wrap text-[11px] text-slate-500">
            <span className="font-semibold text-slate-600">Preset Inquiries:</span>
            <button
              type="button"
              onClick={() => {
                setQuestion("What should I verify before applying for this scholarship?");
                setDomain("scholarship");
              }}
              className="text-blue-700 hover:underline"
            >
              Scholarship Verification
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => {
                setQuestion("What are the approved dosage limits, contraindications, and patient exclusions for this cardiovascular protocol?");
                setDomain("clinical_health");
              }}
              className="text-blue-700 hover:underline"
            >
              Clinical Protocol
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => {
                setQuestion("What are the mandatory statutory compliance obligations and exemptions under the Data Protection Act?");
                setDomain("policy_legal");
              }}
              className="text-blue-700 hover:underline"
            >
              Data Protection (DPDP)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-slate-700 mb-1.5">
              Domain Inquiry Schema
            </label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-semibold focus:border-blue-600 transition"
            >
              <option value="scholarship">Scholarship & Academic Grants (Hackathon Primary)</option>
              <option value="clinical_health">Medical & Clinical Guidelines</option>
              <option value="policy_legal">Regulatory & Policy Compliance</option>
              <option value="general">General Evidence Investigation</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <Shield className="w-4 h-4 text-blue-700 shrink-0" />
              <span>SSRF Security Protection Active: Loopback and RFC 1918 private IPs are blocked.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Source Ingestion Tabs */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">Add Evidence Source</h3>
            <span className="text-xs text-slate-500 font-medium">({sources.length} active in workspace)</span>
          </div>

          <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setActiveInputTab('url')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${
                activeInputTab === 'url' ? 'bg-white text-blue-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Web URL
            </button>
            <button
              onClick={() => setActiveInputTab('text')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${
                activeInputTab === 'text' ? 'bg-white text-blue-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Paste Text
            </button>
            <button
              onClick={() => setActiveInputTab('pdf')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${
                activeInputTab === 'pdf' ? 'bg-white text-blue-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              Upload PDF
            </button>
          </div>
        </div>

        {/* Tab 1: Web URL */}
        {activeInputTab === 'url' && (
          <form onSubmit={handleUrlSubmit} className="mt-4 space-y-3">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="url"
                required
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://scholarships.gov.in/schemes/notification-2025"
                className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:border-blue-600 transition"
              />
              <button
                type="submit"
                disabled={isSubmittingSource || !inputUrl}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition disabled:opacity-50"
              >
                {isSubmittingSource ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Scraping...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Scrape & Ingest</span>
                  </>
                )}
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 flex-wrap gap-2">
              <span>Cheerio extractor extracts article paragraphs while safely discarding navigation headers and ads.</span>
              <div className="flex items-center gap-1.5 font-medium">
                <span className="text-slate-400">Sample URLs:</span>
                <button
                  type="button"
                  onClick={() => setInputUrl('https://scholarships.gov.in/schemes/post-matric-2025')}
                  className="text-blue-700 hover:underline"
                >
                  Portal Notice
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => setInputUrl('https://educationadvisory.org.in/bulletin/scholarship-guide-2024')}
                  className="text-blue-700 hover:underline"
                >
                  Advisory Guide
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: Paste Text */}
        {activeInputTab === 'text' && (
          <form onSubmit={handleTextSubmit} className="mt-4 space-y-3">
            <input
              type="text"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              placeholder="Source Title (e.g. State Welfare Department Circular No. 12)"
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:border-blue-600 transition"
            />
            <textarea
              rows={3}
              required
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste official notification text, circular excerpt, or guidelines here..."
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:border-blue-600 transition"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingSource || !inputText}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Text Evidence</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Upload PDF */}
        {activeInputTab === 'pdf' && (
          <form onSubmit={handlePdfSubmit} className="mt-4 space-y-3">
            <div className="border-2 border-dashed border-slate-300 hover:border-blue-600 rounded-xl p-5 text-center transition cursor-pointer bg-slate-50">
              <input
                type="file"
                accept=".pdf,application/pdf"
                id="pdf-upload"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <label htmlFor="pdf-upload" className="cursor-pointer block">
                <UploadCloud className="w-7 h-7 text-blue-700 mx-auto mb-1.5" />
                {selectedFile ? (
                  <div>
                    <span className="text-xs font-bold text-slate-900">{selectedFile.name}</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      ({Math.round(selectedFile.size / 1024)} KB) - Click to replace
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs font-bold text-slate-700">Click to upload official PDF</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">Up to 10MB · Parsed via pdf-parse</span>
                  </div>
                )}
              </label>
            </div>

            <div className="flex items-center justify-between pt-1">
              <a
                href="/api/sources/sample-pdf"
                download="SuchnaSetu-Sample-Policy-Report.pdf"
                className="inline-flex items-center gap-1.5 text-xs text-blue-700 hover:text-blue-900 font-semibold underline"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample Policy PDF to test upload</span>
              </a>

              <button
                type="submit"
                disabled={isSubmittingSource || !selectedFile}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Parse PDF Text</span>
              </button>
            </div>
          </form>
        )}

        {/* Feedback Message */}
        {feedback.message && (
          <div
            className={`mt-3 p-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
              feedback.type === 'error'
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            {feedback.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
        )}
      </div>

      {/* Active Workspace Sources */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">Active Sources in Session</h3>
            <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700 font-bold">
              {sources.length}
            </span>
          </div>
        </div>

        {sources.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            <FileCheck2 className="w-8 h-8 mx-auto text-slate-400 mb-1.5" />
            <p className="text-xs font-semibold text-slate-700">No sources added to workspace yet.</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Select a Preset Inquiry above, paste a research URL, or upload a PDF document.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 mt-1">
            {sources.map((src, idx) => (
              <div key={src.sourceId || idx} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-900 truncate">{src.title}</span>
                    <SourceAuthorityBadge category={src.sourceType} />
                    {src.demoLabel && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                        {src.demoLabel}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2.5 mt-0.5 truncate">
                    <span>{src.domain || 'Direct Text Input'}</span>
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
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition shrink-0"
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
        <p className="text-xs text-slate-500">
          The 9-step engine will extract claims, compare expected dimensions, and detect omissions.
        </p>

        <button
          onClick={onRunAnalysis}
          disabled={isAnalyzing || sources.length === 0}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs bg-blue-700 hover:bg-blue-800 text-white shadow-sm transition disabled:opacity-50"
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
