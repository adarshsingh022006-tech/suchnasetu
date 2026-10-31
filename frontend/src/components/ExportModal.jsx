import React, { useState } from 'react';
import { X, Download, Copy, Check, Printer, FileText } from 'lucide-react';

export function ExportModal({ isOpen, onClose, report, session }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !report) return null;

  const markdownContent = `# SUCHNASETU RESEARCH INTELLIGENCE REPORT
Generated: ${report.meta?.generatedAt || new Date().toISOString()}
Hackathon: Shinchan Online Hackathon 2026 | Digital Dark Spot

## Research Objective
- Question: ${report.objective?.question || session?.question}
- Domain: ${report.objective?.domainName}
- Reviewed Sources: ${report.sourcesSummary?.activeCount || 0}
- Reviewed Coverage: ${report.completenessMap?.coveragePercentage || 0}%

## Executive Summary
${report.executiveSummary?.headline || ''}
${(report.executiveSummary?.criticalFindings || []).map(f => `- ${f}`).join('\n')}

## 1. Source-Supported Findings
${report.fields?.filter(f => f.status === 'Found').map(f => `### ${f.fieldName}
- Status: ${f.status}
- Summary: ${f.assessmentSummary}
- Claims:
${f.claims?.map(c => `  * [${c.claimId}] ${c.subject}: ${c.value} (Source: ${c.sourceTitle})`).join('\n') || 'None'}
`).join('\n')}

## 2. Potential Information Gaps ("Not found in reviewed sources")
${report.fields?.filter(f => f.status === 'Not found in reviewed sources').map(f => `### ${f.fieldName}
- Status: Not found in reviewed sources
- Reason: ${f.gapReason}
- Missing Elements: ${f.missingElements?.join(', ')}
`).join('\n')}

## 3. Possible Contradictions
${report.contradictions?.map(c => `### [${c.conflictId}] ${c.fieldName}: ${c.conflictType}
- Severity: ${c.severity.toUpperCase()}
- Explanation: ${c.explanation}
- Claim A: "${c.claimA.value}" (Source: ${c.claimA.sourceTitle})
- Claim B: "${c.claimB.value}" (Source: ${c.claimB.sourceTitle})
- Suggested Action: ${c.suggestedAction}
`).join('\n') || 'No major contradictions detected.'}

## 4. Freshness & Temporal Cycle Warnings
${report.freshness?.warnings?.map(w => `- [${w.type}] ${w.message} (Source: ${w.sourceTitle})`).join('\n') || 'All sources consistent with current cycle.'}

## 5. Verification Checklist
${report.checklist?.map(item => `[${item.completed ? 'x' : ' '}] (${item.priority}) ${item.task}
    Reason: ${item.reason}
    Suggested Source: ${item.suggestedAuthoritativeSource}
`).join('\n')}

---
Disclaimer: ${report.completenessDisclaimer || report.executiveSummary?.epistemicDisclaimer}
`;

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `suchnasetu_report_${session?.sessionId || 'export'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadMarkdown = () => {
    const dataStr = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(markdownContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `suchnasetu_report_${session?.sessionId || 'export'}.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
      <div className="bg-navy-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Export Research Intelligence Report</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-300 mt-3">
          Download or copy the complete structured report including claim citations, gap analyses, and actionable verification checklists.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6">
          <button
            onClick={handleCopyMarkdown}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-700 bg-navy-850 hover:bg-slate-800 transition group"
          >
            {copied ? <Check className="w-6 h-6 text-emerald-400" /> : <Copy className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition" />}
            <span className="text-xs font-semibold text-slate-200 mt-2">
              {copied ? 'Copied to Clipboard!' : 'Copy Markdown'}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">Plaintext formatted</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-700 bg-navy-850 hover:bg-slate-800 transition group"
          >
            <Download className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition" />
            <span className="text-xs font-semibold text-slate-200 mt-2">Download .MD</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Markdown file</span>
          </button>

          <button
            onClick={handleDownloadJson}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-700 bg-navy-850 hover:bg-slate-800 transition group"
          >
            <Download className="w-6 h-6 text-purple-400 group-hover:scale-110 transition" />
            <span className="text-xs font-semibold text-slate-200 mt-2">Download .JSON</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Full structured dataset</span>
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
