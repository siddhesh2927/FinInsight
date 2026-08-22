'use client';

import { Database, FileSearch, Sparkles } from 'lucide-react';
import { QueryType } from '@/types/chat';

interface QueryBadgeProps {
  type: QueryType;
}

export function QueryBadge({ type }: QueryBadgeProps) {
  const badgeConfig = {
    SQL: {
      container: 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100/50',
      label: 'SQL Analysis',
      sub: 'Structured Data',
      icon: Database,
    },
    RAG: {
      container: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/50',
      label: 'RAG Analysis',
      sub: 'Document Retrieval',
      icon: FileSearch,
    },
    HYBRID: {
      container: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100/50',
      label: 'Hybrid Analysis',
      sub: 'SQL + Document Retrieval',
      icon: Sparkles,
    },
  };

  const current = badgeConfig[type];
  const Icon = current.icon;

  return (
    <div 
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-2xs transition-colors duration-200 ${current.container}`}
    >
      <Icon size={13} className="opacity-90" />
      <span className="font-mono tracking-wider uppercase text-[10px]">{current.label}</span>
      <span className="opacity-40 font-normal">|</span>
      <span className="opacity-80 font-normal text-[11px]">{current.sub}</span>
    </div>
  );
}
