import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { Footer } from './components/Footer.jsx';
import { ExportModal } from './components/ExportModal.jsx';

import { LandingPage } from './pages/LandingPage.jsx';
import { GuidePage } from './pages/GuidePage.jsx';
import { WorkspacePage } from './pages/WorkspacePage.jsx';
import { SourceManagerPage } from './pages/SourceManagerPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { EvidenceExplorerPage } from './pages/EvidenceExplorerPage.jsx';
import { ChecklistPage } from './pages/ChecklistPage.jsx';
import { BenchmarkPage } from './pages/BenchmarkPage.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [session, setSession] = useState(null);
  const [sources, setSources] = useState([]);
  const [report, setReport] = useState(null);

  const [question, setQuestion] = useState('What should I verify before applying for this scholarship?');
  const [domain, setDomain] = useState('scholarship');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Initialize session on mount
  useEffect(() => {
    initDefaultSession();
  }, []);

  const initDefaultSession = async () => {
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, domain })
      });
      const data = await res.json();
      if (data.success && data.session) {
        setSession(data.session);
      }
    } catch (err) {
      console.warn('Initial session creation:', err);
    }
  };

  const ensureSession = async () => {
    if (session && session.sessionId) return session.sessionId;
    const res = await fetch('/api/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, domain })
    });
    const data = await res.json();
    setSession(data.session);
    return data.session.sessionId;
  };

  const handleQuickDemo = async (scenario = 'scholarship') => {
    setIsAnalyzing(true);
    setAnalysisStep(`Ingesting benchmark circulars for '${scenario}'...`);
    try {
      const res = await fetch('/api/research/demo/bootstrap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to bootstrap demo');

      setSession(data.session);
      setReport(data.report);
      setQuestion(data.session.question);
      setDomain(data.session.domain);

      // Fetch loaded sources
      const srcRes = await fetch(`/api/research/${data.sessionId}`);
      const srcData = await srcRes.json();
      if (srcData.sources) setSources(srcData.sources);

      setActiveTab('dashboard');
    } catch (err) {
      alert(`Demo bootstrap error: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  const handleAddUrl = async (url) => {
    const sId = await ensureSession();
    const res = await fetch('/api/sources/url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: sId, url })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to scrape URL');
    setSources(prev => [...prev, data.source]);
  };

  const handleAddText = async ({ title, text }) => {
    const sId = await ensureSession();
    const res = await fetch('/api/sources/text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: sId, title, text })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add text');
    setSources(prev => [...prev, data.source]);
  };

  const handleUploadPdf = async (file) => {
    const sId = await ensureSession();
    const formData = new FormData();
    formData.append('sessionId', sId);
    formData.append('file', file);

    const res = await fetch('/api/sources/upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upload PDF');
    setSources(prev => [...prev, data.source]);
  };

  const handleRemoveSource = async (sourceId) => {
    if (!session) return;
    try {
      const res = await fetch(`/api/sources/${session.sessionId}/${sourceId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setSources(prev => prev.filter(s => s.sourceId !== sourceId));
      }
    } catch (err) {
      console.error('Failed to remove source:', err);
    }
  };

  const handleRunAnalysis = async () => {
    if (!session || sources.length === 0) return;
    setIsAnalyzing(true);

    const steps = [
      'Step 1/9: Analyzing research objective schema...',
      'Step 2/9: Validating and deduplicating source hashes...',
      'Step 3/9: Cleaning paragraphs and defusing injections...',
      'Step 4/9: Extracting structured verifiable claims...',
      'Step 5/9: Detecting information gaps (Digital Dark Spots)...',
      'Step 6/9: Evaluating context-aware contradictions...',
      'Step 7/9: Analyzing temporal freshness & cycle dates...',
      'Step 8/9: Classifying source authority and credentials...',
      'Step 9/9: Generating actionable verification checklist...'
    ];

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      if (currentStepIdx < steps.length) {
        setAnalysisStep(steps[currentStepIdx]);
        currentStepIdx++;
      }
    }, 450);

    try {
      const res = await fetch(`/api/research/${session.sessionId}/analyze`, {
        method: 'POST'
      });
      const data = await res.json();
      clearInterval(interval);

      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setReport(data.report);
      setActiveTab('dashboard');
    } catch (err) {
      clearInterval(interval);
      alert(`Analysis error: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  const handleToggleChecklist = async (itemId, completed) => {
    if (!session || !report) return;

    // Optimistic UI update
    setReport(prev => {
      if (!prev || !prev.checklist) return prev;
      const updated = prev.checklist.map(c => c.itemId === itemId ? { ...c, completed } : c);
      return { ...prev, checklist: updated };
    });

    try {
      await fetch(`/api/research/${session.sessionId}/checklist/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
      });
    } catch (err) {
      console.error('Failed to persist checklist update:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-blue-600/10 selection:text-blue-900">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeSession={{ ...session, sourcesCount: sources.length }}
      />

      {/* Main Page Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {activeTab === 'landing' && (
          <LandingPage
            onStartResearch={() => setActiveTab('workspace')}
            onOpenGuide={() => setActiveTab('guide')}
          />
        )}

        {activeTab === 'guide' && (
          <GuidePage
            onStartResearch={() => setActiveTab('workspace')}
          />
        )}

        {activeTab === 'workspace' && (
          <WorkspacePage
            session={session}
            sources={sources}
            question={question}
            setQuestion={setQuestion}
            domain={domain}
            setDomain={setDomain}
            onAddUrl={handleAddUrl}
            onAddText={handleAddText}
            onUploadPdf={handleUploadPdf}
            onRemoveSource={handleRemoveSource}
            onRunAnalysis={handleRunAnalysis}
            onOpenGuide={() => setActiveTab('guide')}
            isAnalyzing={isAnalyzing}
            analysisStep={analysisStep}
          />
        )}

        {activeTab === 'sources' && (
          <SourceManagerPage
            sources={sources}
            onRemoveSource={handleRemoveSource}
            session={session}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage
            report={report}
            session={session}
            onExport={() => setIsExportModalOpen(true)}
            onNavigateToEvidence={() => setActiveTab('evidence')}
            onNavigateToChecklist={() => setActiveTab('checklist')}
          />
        )}

        {activeTab === 'evidence' && (
          <EvidenceExplorerPage
            report={report}
            session={session}
          />
        )}

        {activeTab === 'checklist' && (
          <ChecklistPage
            report={report}
            session={session}
            onToggleChecklist={handleToggleChecklist}
            onExport={() => setIsExportModalOpen(true)}
          />
        )}

        {activeTab === 'benchmark' && (
          <BenchmarkPage />
        )}
      </main>

      {/* Footer */}
      <Footer onOpenBenchmark={() => setActiveTab('benchmark')} />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        report={report}
        session={session}
      />
    </div>
  );
}
