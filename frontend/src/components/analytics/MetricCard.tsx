'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  sub: string;
}

export function MetricCard({ label, value, change, positive, sub }: MetricCardProps) {
  return (
    <div className="bg-white border border-[#e2e5ed] rounded-lg p-4 flex flex-col gap-1.5 hover:border-[#1a4fcc]/40 hover:shadow-xs transition-all duration-200">
      <span className="text-[10px] text-[#6b7280] font-bold uppercase tracking-wider">{label}</span>
      <span className="text-2xl font-bold text-[#0d1117] tabular-nums tracking-tight">{value}</span>
      <div className="flex items-center gap-1.5 mt-0.5">
        <div 
          className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-semibold
            ${positive 
              ? 'text-emerald-700 bg-emerald-50' 
              : 'text-red-600 bg-red-50'
            }`}
        >
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{change}</span>
        </div>
        <span className="text-[11px] text-[#6b7280] font-medium">{sub}</span>
      </div>
    </div>
  );
}
