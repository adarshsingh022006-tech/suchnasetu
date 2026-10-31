import React from 'react';
import { Shield, Sparkles, Terminal, Cpu } from 'lucide-react';

export function Footer({ onOpenBenchmark }) {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-navy-950/90 py-8 mt-16 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="SuchnaSetu Logo" className="w-6 h-6 opacity-80" />
            <div>
              <span className="font-bold text-slate-200">SUCHNASETU</span>
              <span className="text-slate-400 ml-2">Connecting Information. Revealing What's Missing.</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5 text-indigo-400">
              <Cpu className="w-3.5 h-3.5" />
              Shinchan Online Hackathon 2026
            </span>
            <span>·</span>
            <span className="text-slate-400">Digital Dark Spot Challenge</span>
            <span>·</span>
            <button 
              onClick={onOpenBenchmark}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium transition"
            >
              <Terminal className="w-3.5 h-3.5" />
              Run Evaluation Suite
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <p>
            Evidence-backed research intelligence platform. Outputs reflect verified source citations only.
          </p>
          <p>
            Built with React, Node.js, Express, Cheerio, Mongoose & Hybrid Deterministic/LLM Intelligence.
          </p>
        </div>
      </div>
    </footer>
  );
}
