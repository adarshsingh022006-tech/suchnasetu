import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  Cpu, 
  RefreshCw,
  Layers,
  AlertTriangle
} from 'lucide-react';

export function BenchmarkPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [suiteResult, setSuiteResult] = useState(null);
  const [error, setError] = useState(null);

  const handleRunEvaluation = async () => {
    setIsRunning(true);
    setError(null);
    try {
      const res = await fetch('/api/evaluate/run');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Evaluation failed');
      setSuiteResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Evaluation & Benchmark Suite
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Automated evaluation verifying gap detection accuracy, contradiction precision, SSRF defense, and prompt injection neutralization.
          </p>
        </div>

        <button
          onClick={handleRunEvaluation}
          disabled={isRunning}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Executing Benchmark...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Run Live Benchmark Suite</span>
            </>
          )}
        </button>
      </div>

      {/* Summary Scorecard if run */}
      {suiteResult && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-navy-900/80 border border-slate-800">
            <div className="text-2xl font-bold text-white">{suiteResult.summary.total}</div>
            <div className="text-xs text-slate-400 mt-0.5">Total Benchmark Cases</div>
          </div>
          <div className="p-4 rounded-xl bg-navy-900/80 border border-slate-800">
            <div className="text-2xl font-bold text-emerald-400">{suiteResult.summary.passed}</div>
            <div className="text-xs text-slate-400 mt-0.5">Passed Tests</div>
          </div>
          <div className="p-4 rounded-xl bg-navy-900/80 border border-slate-800">
            <div className="text-2xl font-bold text-indigo-400">{suiteResult.summary.passRate}</div>
            <div className="text-xs text-slate-400 mt-0.5">Accuracy Pass Rate</div>
          </div>
          <div className="p-4 rounded-xl bg-navy-900/80 border border-slate-800">
            <div className="text-2xl font-bold text-cyan-400">{suiteResult.summary.totalDurationMs} ms</div>
            <div className="text-xs text-slate-400 mt-0.5">Execution Latency</div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-300">
          <strong>Evaluation Error:</strong> {error}
        </div>
      )}

      {/* Test Cases List */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Evaluation Test Cases (Shinchan 2026 Dark Spot Benchmark)
          </h3>
          <span className="text-xs text-slate-400">6 Automated Checks</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {(suiteResult ? suiteResult.results : defaultTestCases).map((tc) => {
            const isPassed = tc.status === 'PASSED';

            return (
              <div key={tc.testId} className="p-5 hover:bg-navy-900/40 transition space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {tc.testId}
                      </span>
                      <h4 className="text-sm font-bold text-white">{tc.name}</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{tc.details}</p>
                  </div>

                  <div className="shrink-0">
                    {suiteResult ? (
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          isPassed
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {tc.status}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-mono">Ready to run</span>
                    )}
                  </div>
                </div>

                {suiteResult && (
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400 bg-navy-950/80 p-2.5 rounded-lg border border-slate-800/80 font-mono">
                    <span>
                      <strong className="text-slate-300 font-semibold">Observed:</strong> {tc.observed}
                    </span>
                    <span>
                      <strong className="text-slate-300 font-semibold">Expected:</strong> {tc.expected}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const defaultTestCases = [
  {
    testId: 'TC-01-GAP-DETECTION',
    name: 'Information Gap Detection Precision',
    details: 'Verifies that "Renewal Conditions" is classified as "Not found in reviewed sources" without hallucinating missing facts.'
  },
  {
    testId: 'TC-02-CONTRADICTION-DETECTION',
    name: 'Context-Aware Contradiction Detection',
    details: 'Verifies detection of conflicting application modes (100% online portal vs physical District Office) and differing income caps (₹2.5L vs ₹2.0L).'
  },
  {
    testId: 'TC-03-CYCLE-FRESHNESS',
    name: 'Temporal Cycle Freshness Intelligence',
    details: 'Verifies that Source 2 referencing cycle 2024 is flagged as outdated cycle while retaining historical validity.'
  },
  {
    testId: 'TC-04-DUPLICATE-SUPPRESSION',
    name: 'Cryptographic SHA-256 Duplicate Suppression',
    details: 'Verifies that duplicate content hashes and matching canonical URLs are quarantined to prevent double counting.'
  },
  {
    testId: 'TC-05-PROMPT-INJECTION-DEFENSE',
    name: 'Prompt Injection Defusal & Context Neutralization',
    details: 'Verifies that instruction override patterns ([INST], "ignore previous instructions") are neutralized to inert tags.'
  },
  {
    testId: 'TC-06-SSRF-DEFENSE',
    name: 'SSRF & Private Subnet Protection',
    details: 'Verifies that loopback (127.0.0.1) and AWS/GCP metadata endpoints (169.254.169.254) are rejected.'
  }
];
