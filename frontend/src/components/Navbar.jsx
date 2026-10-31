import React from 'react';
import { 
  Sparkles, 
  Layers, 
  Database, 
  Search, 
  FileCheck2, 
  Terminal, 
  CheckSquare, 
  BookOpen,
  Plus
} from 'lucide-react';

export function Navbar({ activeTab, setActiveTab, activeSession }) {
  const navItems = [
    { id: 'landing', label: 'Overview', icon: Sparkles },
    { id: 'guide', label: 'User Guide', icon: BookOpen },
    { id: 'workspace', label: 'Workspace', icon: Search },
    { id: 'sources', label: 'Sources', icon: Database, badge: activeSession?.sourcesCount },
    { id: 'dashboard', label: 'Intelligence Brief', icon: Layers },
    { id: 'evidence', label: 'Evidence Lineage', icon: FileCheck2 },
    { id: 'checklist', label: 'Verification Checklist', icon: CheckSquare },
    { id: 'benchmark', label: 'Evaluation Suite', icon: Terminal }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200/90 shadow-sm">
      {/* Official Top Accent Strip */}
      <div className="h-1 bg-gradient-to-r from-blue-700 via-indigo-600 to-amber-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div 
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-1 shadow-sm group-hover:border-blue-300 transition">
              <img src="/logo.svg" alt="SuchnaSetu Logo" className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-slate-900">
                  SUCHNASETU
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                  (सूचना सेतु)
                </span>
                <span className="hidden sm:inline text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 tracking-wider uppercase">
                  Shinchan Hackathon '26
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                AI-Assisted Information Gap & Verification Platform
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
                      ? 'text-blue-800 bg-blue-50/90 border border-blue-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                  {item.label}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-800 font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* New Research CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('workspace')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-sm transition active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Investigation</span>
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Scroll Menu */}
        <div className="lg:hidden flex items-center overflow-x-auto py-2 space-x-1 border-t border-slate-200/80 no-scrollbar">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                  isActive
                    ? 'text-blue-800 bg-blue-50 border border-blue-200 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
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
