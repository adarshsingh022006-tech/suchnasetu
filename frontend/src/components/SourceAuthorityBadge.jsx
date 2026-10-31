import React from 'react';
import { ShieldCheck, GraduationCap, Newspaper, FileText, Globe } from 'lucide-react';

export function SourceAuthorityBadge({ category = '', badgeClass = '' }) {
  const norm = (badgeClass || category || '').toLowerCase();

  if (norm.includes('official') || norm.includes('gov')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        Official Government
      </span>
    );
  }

  if (norm.includes('institution') || norm.includes('academic') || norm.includes('edu')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
        <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
        Institutional / Academic
      </span>
    );
  }

  if (norm.includes('editorial') || norm.includes('news')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">
        <Newspaper className="w-3.5 h-3.5 text-purple-400" />
        News / Editorial
      </span>
    );
  }

  if (norm.includes('document') || norm.includes('pdf')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
        <FileText className="w-3.5 h-3.5 text-cyan-400" />
        Direct Document
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
      <Globe className="w-3.5 h-3.5 text-amber-400" />
      General / Community
    </span>
  );
}
