import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  CheckCircle2, 
  XCircle, 
  RefreshCw
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
    <div className="max-w-5xl mx-auto space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-blue-700" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Automated Evaluation Suite
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated test runner verifying gap detection precision, context-aware contradiction detection, SSRF protection, and prompt injection defusal.
          </p>
        </div>

        <button
          onClick={handleRunEvaluation}
          disabled={isRunning}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-blue-700 hover:bg-blue-800 text-white shadow-sm transition disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Running Suite...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Run Automated Suite</span>
            </>
          )}
        </button>
      </div>

      {/* Summary Scorecard */}
      {suiteResult && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-xl font-extrabold text-slate-900">{suiteResult.summary.total}</div>
            <div className="text-xs text-slate-500 mt-0.5">Total Benchmark Tests</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-xl font-extrabold text-emerald-700">{suiteResult.summary.passed}</div>
            <div className="text-xs text-slate-500 mt-0.5">Passed Tests</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-xl font-extrabold text-blue-700">{suiteResult.summary.passRate}</div>
            <div className="text-xs text-slate-500 mt-0.5">Accuracy Pass Rate</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-xl font-extrabold text-slate-700">{suiteResult.summary.totalDurationMs} ms</div>
            <div className="text-xs text-slate-500 mt-0.5">Execution Latency</div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-semibold">
          <strong>Evaluation Error:</strong> {error}
        </div>
      )}

      {/* Test Cases List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Evaluation Test Cases (Shinchan 2026 Dark Spot Benchmark)
          </h3>
          <span className="text-xs text-slate-500 font-medium">6 Automated Checks</span>
        </div>

        <div className="divide-y divide-slate-100">
          {(suiteResult ? suiteResult.results : defaultTestCases).map((tc) => {
            const isPassed = tc.status === 'PASSED';

            return (
              <div key={tc.testId} className="p-4 hover:bg-slate-50/70 transition space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {tc.testId}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{tc.name}</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{tc.details}</p>
                  </div>

                  <div className="shrink-0">
                    {suiteResult ? (
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          isPassed
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
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
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono">
                    <span>
                      <strong className="text-slate-800 font-semibold">Observed:</strong> {tc.observed}
                    </span>
                    <span>
                      <strong className="text-slate-800 font-semibold">Expected:</strong> {tc.expected}
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
