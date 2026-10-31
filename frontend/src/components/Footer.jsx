import React from 'react';
import { Shield, Terminal, Cpu, CheckCircle } from 'lucide-react';

export function Footer({ onOpenBenchmark }) {
  return (
    <footer className="w-full border-t border-slate-200 bg-white py-8 mt-16 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="SuchnaSetu Logo" className="w-7 h-7" />
            <div>
              <span className="font-bold text-slate-900 text-sm">SUCHNASETU (सूचना सेतु)</span>
              <p className="text-slate-500 text-xs">Connecting Information. Revealing What's Missing.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-slate-600">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 font-semibold border border-blue-200/80">
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              Shinchan Online Hackathon 2026
            </span>
            <span>·</span>
            <span className="text-slate-700 font-medium">Digital Dark Spot Challenge</span>
            <span>·</span>
            <button 
              onClick={onOpenBenchmark}
              className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 font-bold transition underline"
            >
              <Terminal className="w-3.5 h-3.5" />
              Run 6 Automated Benchmark Tests
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <p>
            Evidence-backed research intelligence platform. Findings reflect reviewed sources only.
          </p>
          <p>
            Stack: React, Vite, Node.js, Express, Cheerio, Mongoose & Hybrid Deterministic/LLM Intelligence.
          </p>
        </div>
      </div>
    </footer>
  );
}
