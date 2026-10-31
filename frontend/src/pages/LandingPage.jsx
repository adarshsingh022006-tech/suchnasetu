import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Search, 
  HelpCircle, 
  Layers, 
  ChevronRight, 
  BookOpen, 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert
} from 'lucide-react';

export function LandingPage({ onStartResearch, onOpenGuide }) {
  return (
    <div className="space-y-16 py-6">
      {/* Official Government & Research Notice Banner */}
      <div className="bg-blue-50 border border-blue-200/80 rounded-xl p-3 max-w-4xl mx-auto flex items-center justify-between text-xs text-blue-900 font-medium">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span><strong>Shinchan Online Hackathon 2026:</strong> Official Implementation for <em>Digital Dark Spot – AI-Assisted Information Gap Detection</em>.</span>
        </div>
        <button
          onClick={onOpenGuide}
          className="hidden sm:inline-flex items-center gap-1 font-bold text-[11px] text-blue-700 bg-white px-2.5 py-0.5 rounded border border-blue-200 hover:bg-blue-50 transition"
        >
          <BookOpen className="w-3 h-3" />
          <span>Read Platform Guide</span>
        </button>
      </div>

      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4 pt-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold mb-5 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-blue-700" />
          <span>Connecting Information. Revealing What's Missing.</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight">
          Don't Just Summarize What Exists.{' '}
          <span className="text-blue-700 block mt-1.5">
            Expose What's Missing Before You Apply.
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Standard search engines and generic chatbots summarize whatever they find. <strong className="text-slate-900">SuchnaSetu</strong> analyzes official circulars, advisory digests, and web portals to detect <strong className="text-amber-700">silent omissions</strong>, <strong className="text-rose-700">procedural contradictions</strong>, and <strong className="text-purple-700">stale application cycles</strong>.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={onStartResearch}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-blue-700 hover:bg-blue-800 text-white shadow-sm hover:shadow transition active:scale-[0.98]"
          >
            <Search className="w-4 h-4" />
            <span>Open Research Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenGuide}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-sm transition active:scale-[0.98]"
          >
            <BookOpen className="w-4 h-4 text-blue-700" />
            <span>View Complete User Guide</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Core Indicators Bar */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-xl font-extrabold text-blue-900">100% Traceable</div>
            <div className="text-xs text-slate-500 mt-0.5">Every claim has exact quote citations</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-xl font-extrabold text-orange-600">Gap Detection</div>
            <div className="text-xs text-slate-500 mt-0.5">Flags missing policy criteria explicitly</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-xl font-extrabold text-rose-600">Conflict Engine</div>
            <div className="text-xs text-slate-500 mt-0.5">Compares comparable rules & channels</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-xl font-extrabold text-emerald-700">SSRF Guarded</div>
            <div className="text-xs text-slate-500 mt-0.5">Safe, isolated URL web extraction</div>
          </div>
        </div>
      </section>

      {/* The Problem: Why Ordinary AI Fails */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              The Real-World Problem
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-3">
              The "Digital Dark Spot" in Critical Decision Making
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              When applying for a state scholarship or university grant, what is <em>not said</em> in a guideline is often what causes rejection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6 pt-6 border-t border-slate-100">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-700 font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Silent Information Gaps</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                If a state portal fails to disclose <strong>renewal conditions</strong> (e.g. required CGPA for 2nd year), users assume none exist. SuchnaSetu flags it as <em>"Not found in reviewed sources"</em>.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Disguised Contradictions</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Source A claims the scheme is 100% paperless online. Source B states physical dossiers must be submitted at the District Welfare Office. Standard summarizers merge them into a confusing mess.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Stale Application Cycles</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aggregator blogs frequently show 2024 deadlines and obsolete income caps. SuchnaSetu contextualizes cycle years without discarding historical documents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Practical Guide Callout Card */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              Interactive Guidance
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              New to SuchnaSetu? Learn the 6-Step Research Workflow
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Read our step-by-step documentation on formulating inquiries, gathering multi-modal evidence (URLs, PDFs, circular text), reading the Research Completeness Map, and working with pre-application checklists.
            </p>
          </div>

          <button
            onClick={onOpenGuide}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-sm transition shrink-0"
          >
            <BookOpen className="w-4 h-4" />
            <span>Open User Guide</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* The 9-Step Pipeline Methodology */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs uppercase font-bold tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
            Methodology
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-2">
            The 9-Step Research Intelligence Engine
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Built modularly with strict JSON claim extraction and deterministic verification logic.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {[
            { step: '01', title: 'Objective Analysis', desc: 'Converts question into concrete expected fields (eligibility, income, documents, deadline, renewal, process, link).' },
            { step: '02', title: 'Source Fingerprinting', desc: 'Deduplicates via SHA-256 hashes and canonical URLs to prevent double counting.' },
            { step: '03', title: 'Context & Defusal', desc: 'Strips web boilerplate and defuses prompt injection tags ([INST], override).' },
            { step: '04', title: 'Structured Claims', desc: 'Extracts claims with subject, predicate, value, date/cycle, and verbatim quotes.' },
            { step: '05', title: 'Gap Detection', desc: 'Identifies unaddressed fields as "Not found in reviewed sources". Never fabricates.' },
            { step: '06', title: 'Contradiction Engine', desc: 'Compares comparable rules to flag procedural and threshold discrepancies.' },
            { step: '07', title: 'Freshness Intelligence', desc: 'Flags older cycle references against current academic timeline.' },
            { step: '08', title: 'Source Authority', desc: 'Categorizes Government (.gov), Institutional (.edu), News, and Community.' },
            { step: '09', title: 'Actionable Checklist', desc: 'Produces a prioritized verification checklist before submitting paperwork.' },
          ].map(item => (
            <div key={item.step} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                  STEP {item.step}
                </span>
                <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
