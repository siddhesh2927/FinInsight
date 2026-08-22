'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Database, 
  MessageSquare, 
  Clock 
} from 'lucide-react';
import { QueryBadge } from '@/components/chat/QueryBadge';
import { mockHistory } from '@/lib/mockData';

export default function DashboardPage() {
  const [input, setInput] = useState('');
  const router = useRouter();

  const suggested = [
    'Compare Q1, Q2 and Q3 revenue',
    'Why did Q3 profit decline?',
    'Show operating margin by quarter',
    'What risks were mentioned in the annual report?',
  ];

  const handleSubmit = (q: string) => {
    if (!q.trim()) return;
    router.push(`/dashboard/chat?q=${encodeURIComponent(q)}`);
  };

  const stats = [
    { label: 'Documents Indexed', value: '3', icon: FileText, color: 'text-blue-600 bg-blue-50' },
    { label: 'Datasets Connected', value: '2', icon: Database, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Queries Analyzed', value: '47', icon: MessageSquare, color: 'text-violet-600 bg-violet-50' },
    { label: 'Last Analysis', value: '2h ago', icon: Clock, color: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] px-6 py-12 md:py-16">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Hero Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700 shadow-2xs">
            <Sparkles size={12} />
            <span>AI Reasoning Workspace</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#0d1117] tracking-tight leading-tight select-none">
            Financial Intelligence
          </h2>
          <p className="text-[#6b7280] text-sm md:text-base max-w-lg mx-auto">
            Retrieve answers from documents and database tables in one hybrid workflow.
          </p>
        </div>

        {/* Big AI Input */}
        <div className="bg-white border border-[#e2e5ed] rounded-xl p-2.5 shadow-sm focus-within:border-[#1a4fcc] focus-within:ring-4 focus-within:ring-blue-100 transition-all duration-200">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <Sparkles className="text-[#9ca3af] flex-shrink-0" size={20} />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit(input)}
              placeholder="Ask about revenue, profit, expenses, risks, or financial performance..."
              className="flex-1 text-sm text-[#0d1117] placeholder:text-[#9ca3af] outline-none bg-transparent"
            />
            <button
              onClick={() => handleSubmit(input)}
              className="flex items-center gap-1 px-4 py-2 bg-[#1a4fcc] text-white text-xs font-bold rounded-lg hover:bg-[#1642b0] shadow-sm transition-colors cursor-pointer"
            >
              <span>Analyze</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Suggested Queries */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">Suggested Questions</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {suggested.map((q) => (
              <button
                key={q}
                onClick={() => handleSubmit(q)}
                className="text-left px-4 py-3.5 bg-white border border-[#e2e5ed] rounded-xl text-xs font-semibold text-[#374151] hover:border-[#1a4fcc] hover:text-[#1a4fcc] hover:bg-[#f0f4ff] shadow-3xs transition-all duration-200 cursor-pointer"
              >
                <span className="text-[#9ca3af] mr-2">→</span>
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div 
                key={s.label} 
                className="bg-white border border-[#e2e5ed] rounded-xl p-5 hover:border-[#1a4fcc]/30 shadow-3xs transition-all duration-200"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3.5 ${s.color}`}>
                  <Icon size={20} />
                </div>
                <div className="text-2xl font-bold text-[#0d1117] tabular-nums tracking-tight">
                  {s.value}
                </div>
                <div className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider mt-1">
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Queries */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">Recent Analyses</p>
          <div className="bg-white border border-[#e2e5ed] rounded-xl overflow-hidden divide-y divide-[#f0f2f7] shadow-3xs">
            {mockHistory.slice(0, 3).map((h) => (
              <button
                key={h.id}
                onClick={() => handleSubmit(h.question)}
                className="w-full flex items-start gap-4 px-5 py-4 text-left hover:bg-[#f8fafc] transition-colors cursor-pointer group"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <QueryBadge type={h.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#0d1117] group-hover:text-[#1a4fcc] transition-colors truncate">
                    {h.question}
                  </p>
                  <p className="text-[11px] text-[#6b7280] mt-1 truncate">
                    {h.preview}
                  </p>
                </div>
                <span className="text-[10px] text-[#9ca3af] font-medium flex-shrink-0 mt-0.5">
                  {h.date.split('·')[0].trim()}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
