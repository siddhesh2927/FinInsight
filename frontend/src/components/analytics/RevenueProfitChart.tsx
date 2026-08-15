'use client';

import { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area,
  Bar
} from 'recharts';
import { Download } from 'lucide-react';
import { revenueData } from '../../lib/mockData';

export function RevenueProfitChart() {
  const [mounted, setMounted] = useState(false);

  // Avoid Next.js hydration issues by waiting until mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[200px] bg-slate-50 animate-pulse rounded-lg border border-dashed border-[#e2e5ed] flex items-center justify-center">
        <span className="text-xs text-[#6b7280] font-mono">Loading charts...</span>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e2e5ed] rounded-lg p-5 hover:shadow-xs transition-all duration-200">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm font-bold text-[#0d1117]">Revenue & Profit Trend</p>
          <p className="text-xs text-[#6b7280] mt-0.5">Q1 – Q4 2025 · FinCorp Inc.</p>
        </div>
        <button 
          aria-label="Export Chart Data"
          className="flex items-center gap-1 text-[11px] text-[#4b5563] hover:text-[#0d1117] px-2.5 py-1.5 rounded-lg hover:bg-[#f7f8fa] border border-[#e2e5ed] font-medium transition-colors cursor-pointer"
        >
          <Download size={12} />
          <span>Export</span>
        </button>
      </div>

      <div className="w-full h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={revenueData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f7" vertical={false} />
            <XAxis 
              dataKey="quarter" 
              tick={{ fontSize: 11, fill: '#6b7280' }} 
              axisLine={false} 
              tickLine={false} 
            />
            <YAxis 
              tick={{ fontSize: 11, fill: '#6b7280' }} 
              axisLine={false} 
              tickLine={false} 
            />
            <Tooltip
              contentStyle={{ border: '1px solid #e2e5ed', borderRadius: 8, fontSize: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
              formatter={(v) => [`$${v}M`]}
            />
            <Legend 
              wrapperStyle={{ fontSize: 11, paddingTop: 10 }} 
              iconType="circle"
              iconSize={8}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              fill="#eff6ff" 
              stroke="#1a4fcc" 
              strokeWidth={2} 
              name="Revenue" 
            />
            <Bar 
              dataKey="profit" 
              fill="#0ea5e9" 
              radius={[4, 4, 0, 0]} 
              name="Net Profit" 
              opacity={0.9} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
