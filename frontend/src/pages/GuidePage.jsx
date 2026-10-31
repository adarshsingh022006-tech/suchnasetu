import React from 'react';
import { 
  BookOpen, 
  Search, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldAlert, 
  ShieldCheck, 
  FileText, 
  CheckSquare, 
  Download, 
  HelpCircle, 
  ArrowRight,
  Globe,
  UploadCloud,
  FileCheck2,
  AlertCircle
} from 'lucide-react';

export function GuidePage({ onStartResearch }) {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-3">
          <BookOpen className="w-3.5 h-3.5 text-blue-700" />
          <span>Platform Documentation & Workflow Guide</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          How SuchnaSetu Works: User Guide & Methodology
        </h1>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          A comprehensive guide to detecting information gaps, identifying conflicting requirements, evaluating source freshness, and building actionable verification checklists.
        </p>
      </div>

      {/* Section 1: The Core Philosophy */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
            01
          </div>
          <h2 className="text-lg font-bold text-slate-900">The Problem: Understanding "Digital Dark Spots"</h2>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          When applicants research government scholarships, healthcare protocols, or regulatory compliance policies, search engines typically show what has been published. However, the most frequent causes of rejection or compliance failure are <strong>silent omissions</strong> and <strong>undisclosed rules</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-orange-800 flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" />
              Information Gaps
            </span>
            <p className="text-[11px] text-slate-600">
              Clauses omitted from official guides (e.g. renewal CGPA conditions). SuchnaSetu explicitly labels these as <em>"Not found in reviewed sources"</em>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-rose-800 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              Discrepancies
            </span>
            <p className="text-[11px] text-slate-600">
              Direct procedural disagreements between sources (e.g. 100% online portal vs physical counter submission at the District Office).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-purple-800 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Temporal Freshness
            </span>
            <p className="text-[11px] text-slate-600">
              Guidance dating back to previous application cycles (e.g. 2024 deadlines or outdated income caps) requiring verification.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Step-by-Step Workflow */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-700" />
          <span>Step-by-Step Research Workflow</span>
        </h2>

        {/* Workflow Step 1 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
              STEP 1
            </span>
            <h3 className="text-sm font-bold text-slate-900">Define Your Research Question & Select Schema</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Navigate to the <strong>Workspace</strong>. Enter the core inquiry you need to verify (e.g., <em>"What should I verify before applying for this scholarship?"</em> or <em>"What are the dosage limits and contraindications for this protocol?"</em>).
          </p>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <strong>Supported Inquiry Domains:</strong>
            <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-600">
              <li><strong>Scholarship & Academic Grants:</strong> Analyzes eligibility, income, documents, deadlines, renewal policy, submission mode, and official portal links.</li>
              <li><strong>Medical & Clinical Guidelines:</strong> Analyzes indications, dosage titration, patient contraindications, and clinical trial outcomes.</li>
              <li><strong>Regulatory & Policy Compliance:</strong> Analyzes jurisdiction, mandatory fiduciaries, statutory enforcement dates, and penalty ceilings.</li>
              <li><strong>General Investigation:</strong> Generic verifiable dimension evaluation.</li>
            </ul>
          </div>
        </div>

        {/* Workflow Step 2 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
              STEP 2
            </span>
            <h3 className="text-sm font-bold text-slate-900">Ingest Evidence from Multiple Independent Sources</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            SuchnaSetu operates on the principle of comparative source intelligence. You can add evidence through three methods:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-blue-700" /> Web URLs
              </span>
              <p className="text-slate-600 text-[11px]">
                Paste official portal URLs or advisory websites. Cheerio strips web ads and boilerplate safely behind an SSRF firewall.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-blue-700" /> Direct Text Excerpts
              </span>
              <p className="text-slate-600 text-[11px]">
                Paste circular paragraphs, gazette notices, or committee meeting notes directly into the text editor.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <UploadCloud className="w-3.5 h-3.5 text-blue-700" /> PDF Guidelines
              </span>
              <p className="text-slate-600 text-[11px]">
                Upload official PDF scheme brochures up to 10MB. The server extracts clean text layers while fingerprinting SHA-256 hashes.
              </p>
            </div>
          </div>
        </div>

        {/* Workflow Step 3 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
              STEP 3
            </span>
            <h3 className="text-sm font-bold text-slate-900">Execute the 9-Step Intelligence Pipeline</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Click <strong>"Execute Research Intelligence Pipeline"</strong> in the Workspace. The modular backend coordinates:
          </p>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 space-y-1">
            <div>1. Objective Dimension Schema Deconstruction</div>
            <div>2. Cryptographic SHA-256 Deduplication & Canonical URL Filtering</div>
            <div>3. Boilerplate Stripping & Prompt Injection Defusal ([INST], override neutralization)</div>
            <div>4. Structured JSON Claim Extraction (Subject, Predicate, Value, Verbatim Quote)</div>
            <div>5. Information Gap Detection & Matrix Alignment</div>
            <div>6. Context-Aware Contradiction & Discrepancy Evaluation</div>
            <div>7. Temporal Cycle Freshness & Stale Date Analysis</div>
            <div>8. Transparent Authority Classification (.gov, .edu, news, community)</div>
            <div>9. Actionable Verification Checklist Generation</div>
          </div>
        </div>

        {/* Workflow Step 4 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
              STEP 4
            </span>
            <h3 className="text-sm font-bold text-slate-900">Review the Intelligence Brief & Completeness Map</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Upon completion, the <strong>Intelligence Brief</strong> dashboard presents:
          </p>
          <ul className="list-disc list-inside text-xs text-slate-700 space-y-1.5">
            <li><strong>Research Completeness Map:</strong> Displays evidence coverage percentages across expected dimensions. Note the official disclaimer: coverage reflects reviewed sources only, not absolute truth.</li>
            <li><strong>Identified Digital Dark Spots:</strong> Displays every unaddressed dimension labeled as <em>"Not found in reviewed sources"</em>.</li>
            <li><strong>Possible Contradictions:</strong> Side-by-side comparison boxes contrasting conflicting requirements with exact source citations.</li>
            <li><strong>Freshness Advisories:</strong> Highlights older academic cycle years (e.g., 2024) that may have been superseded.</li>
          </ul>
        </div>

        {/* Workflow Step 5 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
              STEP 5
            </span>
            <h3 className="text-sm font-bold text-slate-900">Audit Claim Lineage in the Evidence Explorer</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Visit the <strong>Evidence Lineage</strong> tab to verify that no claims were hallucinated. Click <strong>"Inspect"</strong> on any claim card to view:
          </p>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
            <div>• The exact grounded verbatim quote from the source document.</div>
            <div>• The cryptographic SHA-256 fingerprint and source identifier.</div>
            <div>• Publisher authority category (Official Government, Institutional, News, Community).</div>
          </div>
        </div>

        {/* Workflow Step 6 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
              STEP 6
            </span>
            <h3 className="text-sm font-bold text-slate-900">Execute the Pre-Application Verification Checklist</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Open the <strong>Verification Checklist</strong> tab. Work through prioritized tasks (<code>CRITICAL</code>, <code>HIGH</code>, <code>MEDIUM</code>). Check off items as you verify them directly with authorities. Your progress is saved automatically.
          </p>
        </div>
      </section>

      {/* Section 3: Essential Research Best Practices */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <h2 className="text-base font-bold text-slate-900">Civic Research Best Practices</h2>
        </div>

        <div className="space-y-3 text-xs text-slate-700">
          <div className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-700 mt-1.5 shrink-0" />
            <p>
              <strong>Always include an official regulatory source:</strong> Pair advisory blog posts with the primary statutory portal (`.gov.in`, `.nic.in`, `.edu.in`) to expose procedural divergence.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-700 mt-1.5 shrink-0" />
            <p>
              <strong>Do not assume silence means permission:</strong> If renewal conditions or income certificate issuer grades are absent from reviewed circulars, contact the nodal officer before filing.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-700 mt-1.5 shrink-0" />
            <p>
              <strong>Watch for annual cycle rollovers:</strong> Government notifications issued in June/July often supersede rules published earlier in January. Compare publication dates in the Source Registry.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Epistemic Disclaimers */}
      <section className="bg-slate-100 rounded-2xl p-6 border border-slate-200 space-y-3 text-xs text-slate-600">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <HelpCircle className="w-4 h-4 text-blue-700" />
          <span>Epistemic Scope & Limitations</span>
        </div>
        <p className="leading-relaxed">
          SuchnaSetu evaluates evidence <strong>exclusively across the sources provided</strong> to or retrieved during the research session. The statement <em>"Not found in reviewed sources"</em> indicates that the reviewed corpus does not contain the required criteria; it does not claim universal absence across all unreviewed government circulars.
        </p>
      </section>

      {/* CTA Button */}
      <div className="text-center pt-2">
        <button
          onClick={onStartResearch}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs bg-blue-700 hover:bg-blue-800 text-white shadow-sm transition active:scale-[0.98]"
        >
          <Search className="w-4 h-4" />
          <span>Start a Research Session in Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
