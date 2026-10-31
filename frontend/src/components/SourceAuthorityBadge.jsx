import React from 'react';
import { ShieldCheck, GraduationCap, Newspaper, FileText, Globe } from 'lucide-react';

export function SourceAuthorityBadge({ category = '', badgeClass = '' }) {
  const norm = (badgeClass || category || '').toLowerCase();

  if (norm.includes('official') || norm.includes('gov')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        Official Government Source
      </span>
    );
  }

  if (norm.includes('institution') || norm.includes('academic') || norm.includes('edu')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200/80">
        <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        Institutional / Academic
      </span>
    );
  }

  if (norm.includes('editorial') || norm.includes('news')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200/80">
        <Newspaper className="w-3.5 h-3.5 text-purple-600 shrink-0" />
        News / Editorial
      </span>
    );
  }

  if (norm.includes('document') || norm.includes('pdf')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200/80">
        <FileText className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
        Verified Document (PDF)
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200/80">
      <Globe className="w-3.5 h-3.5 text-amber-600 shrink-0" />
      General / Community Web
    </span>
  );
}
