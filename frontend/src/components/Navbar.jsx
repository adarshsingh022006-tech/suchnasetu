import React from 'react';
import { 
  Sparkles, 
  Layers, 
  Database, 
  Search, 
  FileCheck2, 
  ShieldCheck, 
  Terminal, 
  CheckSquare, 
  Play,
  RotateCcw
} from 'lucide-react';

export function Navbar({ activeTab, setActiveTab, onQuickDemo, activeSession, isAnalyzing }) {
  const navItems = [
    { id: 'landing', label: 'Overview', icon: Sparkles },
    { id: 'workspace', label: 'Workspace', icon: Search },
    { id: 'sources', label: 'Sources', icon: Database, badge: activeSession?.sourcesCount },
    { id: 'dashboard', label: 'Intelligence', icon: Layers },
    { id: 'evidence', label: 'Evidence', icon: FileCheck2 },
    { id: 'checklist', label: 'Checklist', icon: CheckSquare },
    { id: 'benchmark', label: 'Benchmark Suite', icon: Terminal }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-navy-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div 
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 p-[1.5px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition">
              <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center overflow-hidden">
                <img src="/logo.svg" alt="SuchnaSetu Logo" className="w-7 h-7 transform group-hover:scale-105 transition" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  SUCHNASETU
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 tracking-wider uppercase">
                  SHINCHAN '26
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-tight">
                Connecting Information. Revealing What's Missing.
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'text-white bg-slate-800/90 shadow-sm border border-slate-700/80'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {item.label}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-500/20 text-indigo-300 font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Demo CTA */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onQuickDemo}
              disabled={isAnalyzing}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:opacity-95 active:scale-[0.98] transition disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline">Load Scholarship Demo</span>
                  <span className="sm:hidden">Demo</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav Bar */}
        <div className="lg:hidden flex items-center overflow-x-auto py-2 space-x-1 border-t border-slate-800/60 no-scrollbar">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${
                  isActive
                    ? 'text-white bg-slate-800 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
