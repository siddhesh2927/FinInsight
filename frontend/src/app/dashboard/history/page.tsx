'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { History, ArrowRight, Calendar, Search } from 'lucide-react';
import { QueryBadge } from '../../../components/chat/QueryBadge';
import { mockHistory } from '../../../lib/mockData';
import { QueryType } from '../../../types/chat';

export default function HistoryPage() {
  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();

  const handleReopen = (q: string) => {
    router.push(`/dashboard/chat?q=${encodeURIComponent(q)}`);
  };

  // Filter list based on select dropdown + search input query
  const filteredHistory = mockHistory.filter((item) => {
    const matchesType = filterType === 'All' || item.type === filterType;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.preview.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 bg-[#f8fafc]">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Title */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#0d1117]">Query History</h2>
            <p className="text-xs text-[#6b7280] mt-0.5">Logs of all previous financial reasoning requests</p>
          </div>

          {/* Filtering controls */}
          <div className="flex items-center gap-3">
            {/* Monospace search */}
            <div className="flex items-center gap-1.5 bg-white border border-[#e2e5ed] rounded-lg px-2.5 py-1.5 shadow-3xs focus-within:border-[#1a4fcc] transition-all">
              <Search size={12} className="text-[#9ca3af]" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search history..."
                className="text-xs outline-none bg-transparent text-[#0d1117] placeholder:text-[#9ca3af] w-36 sm:w-48"
              />
            </div>

            {/* Selector */}
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              aria-label="Filter query history by type"
              className="text-xs border border-[#e2e5ed] rounded-lg px-3 py-1.5 text-[#374151] bg-white outline-none font-semibold shadow-3xs cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <option value="All">All Types</option>
              <option value="SQL">SQL Chains</option>
              <option value="RAG">RAG Chains</option>
              <option value="HYBRID">Hybrid Chains</option>
            </select>
          </div>
        </div>

        {/* History Log Stack */}
        <div className="space-y-3">
          {filteredHistory.map((h) => (
            <div 
              key={h.id} 
              className="bg-white border border-[#e2e5ed] rounded-xl p-5 hover:border-[#1a4fcc] hover:shadow-2xs transition-all duration-200"
            >
              <div className="flex items-start gap-4 flex-wrap md:flex-nowrap">
                {/* Query classifier badge */}
                <div className="flex-shrink-0 mt-0.5">
                  <QueryBadge type={h.type} />
                </div>

                {/* Information contents */}
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-bold text-[#0d1117] tracking-tight">{h.question}</p>
                  <p className="text-xs text-[#6b7280] font-normal leading-relaxed line-clamp-2">{h.preview}</p>
                </div>

                {/* Actions & Dates */}
                <div className="flex flex-col items-end gap-3 flex-shrink-0 justify-between self-stretch">
                  <div className="flex items-center gap-1 text-[10px] text-[#9ca3af] font-mono font-semibold">
                    <Calendar size={12} />
                    <span>{h.date}</span>
                  </div>
                  
                  <button
                    onClick={() => handleReopen(h.question)}
                    className="flex items-center gap-1 text-xs text-[#1a4fcc] hover:text-[#1642b0] hover:underline font-bold transition-all cursor-pointer"
                  >
                    <span>Reopen</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredHistory.length === 0 && (
            <div className="text-center py-16 bg-white border border-[#e2e5ed] rounded-xl shadow-3xs">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-[#9ca3af] mb-3">
                <History size={20} />
              </div>
              <p className="text-sm font-bold text-[#374151]">No matching logs found</p>
              <p className="text-xs text-[#6b7280] mt-1">Try relaxing your search terms or filters.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
