'use client';

import { FileText, ExternalLink } from 'lucide-react';

export interface SourceItem {
  doc: string;
  page: number;
  snippet: string;
  score: number;
}

interface SourcesPanelProps {
  sources?: SourceItem[];
}

const defaultSources: SourceItem[] = [
  { 
    doc: 'Annual_Report_2025.pdf', 
    page: 47, 
    snippet: '"Operating expenses increased primarily due to a 24% rise in personnel costs and a one-time restructuring charge of $1.1M recorded in Q3 2025."', 
    score: 94 
  },
  { 
    doc: 'Q3_Earnings_Transcript.pdf', 
    page: 12, 
    snippet: '"The CFO noted that Q3 margin compression was a direct result of accelerated headcount expansion and integration costs from the July acquisition."', 
    score: 87 
  },
];

export function SourcesPanel({ sources = defaultSources }: SourcesPanelProps) {
  return (
    <div className="bg-white border border-[#e2e5ed] rounded-lg p-5 mb-4 animate-fade-in shadow-xs">
      <p className="text-[10px] font-bold text-[#0d1117] uppercase tracking-wider mb-4">
        Citations & Context · {sources.length} document{sources.length > 1 ? 's' : ''}
      </p>
      
      <div className="space-y-4">
        {sources.map((s) => (
          <div 
            key={s.doc} 
            className="flex gap-4 p-4 rounded-xl bg-[#f8fafc] border border-[#e2e5ed] hover:border-[#1a4fcc]/20 transition-all duration-200"
          >
            {/* File Icon Card */}
            <div className="flex-shrink-0">
              <div className="w-9 h-11 bg-red-50 border border-red-100 rounded-lg flex flex-col items-center justify-center shadow-2xs">
                <FileText size={16} className="text-red-500" />
                <span className="text-[8px] text-red-500 font-extrabold uppercase mt-0.5">PDF</span>
              </div>
            </div>

            {/* Content info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs font-bold text-[#0d1117] truncate max-w-[200px] sm:max-w-none">
                  {s.doc}
                </span>
                <span className="text-[10px] text-[#6b7280] font-mono bg-slate-100 px-1.5 py-0.5 rounded-sm">
                  p. {s.page}
                </span>
                <span className="ml-auto text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg shadow-2xs">
                  {s.score}% Match
                </span>
              </div>
              <p className="text-xs text-[#374151] italic leading-relaxed font-normal bg-white p-2.5 rounded-lg border border-[#e2e5ed]/60 shadow-3xs">
                {s.snippet}
              </p>
              
              <button 
                aria-label={`Open document ${s.doc}`}
                className="mt-2.5 inline-flex items-center gap-1 text-[10px] text-[#1a4fcc] hover:text-[#1642b0] hover:underline font-semibold cursor-pointer"
              >
                <span>View document</span>
                <ExternalLink size={10} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
