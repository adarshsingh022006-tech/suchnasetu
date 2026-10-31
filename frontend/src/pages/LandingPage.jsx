import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  CheckSquare, 
  Search, 
  HelpCircle,
  FileCheck2,
  Cpu,
  Layers,
  ChevronRight,
  Database
} from 'lucide-react';

export function LandingPage({ onStartResearch, onLoadDemo }) {
  return (
    <div className="space-y-24 py-8">
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto px-4 pt-12 pb-6">
        {/* Glow orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-r from-blue-600/15 via-indigo-600/20 to-purple-600/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Official Hackathon Project · Shinchan Online Hackathon 2026</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Connecting Information.{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent block mt-2">
            Revealing What's Missing.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Standard search engines and generic chatbots summarize what exists. <br className="hidden sm:inline" />
          <strong className="text-white font-semibold">SuchnaSetu</strong> exposes the <strong className="text-amber-400 font-semibold">Digital Dark Spot</strong> — unearthing omitted requirements, conflicting procedures, and outdated cycle guidelines with verifiable citations.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartResearch}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition"
          >
            <Search className="w-4 h-4" />
            <span>Launch Research Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onLoadDemo}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-navy-850 hover:bg-slate-800 text-slate-200 border border-slate-700/80 shadow-md hover:scale-[1.02] active:scale-[0.98] transition group"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:animate-ping" />
            <span>Run Scholarship Benchmark Demo</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
          </button>
        </div>

        {/* Live Metrics preview bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
          <div className="p-4 rounded-xl bg-navy-900/60 border border-slate-800/80">
            <div className="text-2xl font-bold text-emerald-400">100%</div>
            <div className="text-xs text-slate-400 mt-0.5">Evidence Traceable</div>
          </div>
          <div className="p-4 rounded-xl bg-navy-900/60 border border-slate-800/80">
            <div className="text-2xl font-bold text-amber-400">Gaps</div>
            <div className="text-xs text-slate-400 mt-0.5">Explicitly Flagged</div>
          </div>
          <div className="p-4 rounded-xl bg-navy-900/60 border border-slate-800/80">
            <div className="text-2xl font-bold text-rose-400">Contextual</div>
            <div className="text-xs text-slate-400 mt-0.5">Contradiction Engine</div>
          </div>
          <div className="p-4 rounded-xl bg-navy-900/60 border border-slate-800/80">
            <div className="text-2xl font-bold text-cyan-400">SSRF Safe</div>
            <div className="text-xs text-slate-400 mt-0.5">Air-Gapped Scraper</div>
          </div>
        </div>
      </section>

      {/* The Problem: The Digital Dark Spot */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs uppercase font-bold tracking-widest text-indigo-400">The Problem Statement</h2>
          <p className="text-2xl sm:text-3xl font-bold text-white mt-2">
            Why Ordinary AI Fails at Critical Real-World Inquiries
          </p>
          <p className="text-sm text-slate-400 mt-3">
            In government schemes, scholarship applications, clinical protocols, and regulatory filings, what is <em>unsaid</em> is often more consequential than what is published.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-5">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Silent Information Gaps</h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              When a policy portal neglects to state <strong className="text-slate-300">renewal GPA requirements</strong>, generic LLMs either hallucinate a plausible rule or fail to warn you that the criterion is completely missing from the reviewed text.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Disguised Contradictions</h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Source A demands physical hard-copy dossier submission at District Welfare counters, while Source B advertises 100% paperless online submission. Summarizers blend them into a single misleading answer.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Stale Application Cycles</h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Old 2024 blog posts with obsolete deadlines and income slabs rank at the top of search results. Users miss out by preparing outdated paperwork without a temporal cycle freshness warning.
            </p>
          </div>
        </div>
      </section>

      {/* How SuchnaSetu Works: The 9-Step Intelligence Pipeline */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs uppercase font-bold tracking-widest text-cyan-400">Architectural Engine</h2>
          <p className="text-2xl sm:text-3xl font-bold text-white mt-2">
            The 9-Step Research Intelligence Engine
          </p>
          <p className="text-sm text-slate-400 mt-3">
            Not a single brittle prompt. A modular, verifiable pipeline separating content ingestion, structured claim schema extraction, and deterministic verification logic.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { step: '01', title: 'Objective Analysis', desc: 'Translates inquiry into rigorous expected information fields.' },
            { step: '02', title: 'Source Ingestion & SHA Dedupe', desc: 'Scrapes URLs with SSRF protection, parses PDFs, hashes content.' },
            { step: '03', title: 'Paragraph Context Cleaning', desc: 'Removes boilerplate and defuses prompt injection tags.' },
            { step: '04', title: 'Structured Claim Extraction', desc: 'Extracts claims with subject, predicate, value, date & quotes.' },
            { step: '05', title: 'Information Gap Detection', desc: 'Detects absent fields: "Not found in reviewed sources".' },
            { step: '06', title: 'Context-Aware Contradictions', desc: 'Identifies conflicting operational rules without false positives.' },
            { step: '07', title: 'Freshness & Cycle Intelligence', desc: 'Compares temporal cycle dates with current academic timelines.' },
            { step: '08', title: 'Source Authority Classification', desc: 'Classifies Gov, Academic, News, and Community transparently.' },
            { step: '09', title: 'Actionable Checklist Generation', desc: 'Produces a prioritized verification checklist before submitting.' },
          ].map(item => (
            <div key={item.step} className="p-4 rounded-xl bg-navy-900/50 border border-slate-800/80 hover:border-slate-700 transition">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400">
                  STEP {item.step}
                </span>
                <h4 className="text-sm font-semibold text-white">{item.title}</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Primary Demonstration Showcase Card */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="glass-panel rounded-3xl p-8 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Primary Demonstration Use Case
              </span>
              <h3 className="text-2xl font-bold text-white mt-3">
                Scholarship Application Dark Spot Benchmark
              </h3>
              <p className="text-sm text-slate-300 mt-1">
                "What should I verify before applying for this scholarship?"
              </p>
            </div>

            <button
              onClick={onLoadDemo}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition shrink-0"
            >
              <Cpu className="w-4 h-4" />
              <span>Load Official Benchmark Case</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-xs">
            <div className="p-4 rounded-xl bg-navy-950/70 border border-slate-800/80">
              <div className="font-bold text-amber-400 mb-1">Identified Dark Spot</div>
              <p className="text-slate-400">
                <strong>Renewal Conditions</strong> completely omitted from all 3 reviewed sources. Accurately tagged as "Not found in reviewed sources".
              </p>
            </div>

            <div className="p-4 rounded-xl bg-navy-950/70 border border-slate-800/80">
              <div className="font-bold text-rose-400 mb-1">Detected Contradiction</div>
              <p className="text-slate-400">
                Source 1 mandates 100% paperless online submission, whereas Source 2 mandates physical submission at District Welfare Office.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-navy-950/70 border border-slate-800/80">
              <div className="font-bold text-purple-400 mb-1">Freshness Advisory</div>
              <p className="text-slate-400">
                Source 2 references older cycle 2024 and closed August 15 deadline, generating an actionable cycle freshness check.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
