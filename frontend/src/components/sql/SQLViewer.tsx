'use client';

import { useState } from 'react';
import { Copy, Play, Check, Download } from 'lucide-react';
import { revenueData } from '@/lib/mockData';

interface SQLViewerProps {
  query?: string;
  results?: typeof revenueData;
}

const defaultQuery = `SELECT
  quarter,
  revenue,
  operating_expense,
  net_profit,
  ROUND((net_profit / revenue) * 100, 2) AS margin_pct
FROM financial_data
WHERE company_id = 'FINCORP'
  AND year = 2025
ORDER BY quarter;`;

export function SQLViewer({ query = defaultQuery, results = revenueData }: SQLViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(query);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-[#0d1117] rounded-xl p-5 mb-4 border border-[#1e2633] shadow-md animate-fade-in">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-3.5">
        <span className="text-[10px] font-mono text-[#8b949e] uppercase tracking-wider font-bold">
          Generated SQL
        </span>
        <div className="flex gap-2">
          <button 
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-[10px] text-[#c9d1d9] hover:text-white px-2.5 py-1.5 rounded-lg bg-[#161b22] hover:bg-[#21262d] font-mono border border-[#30363d] transition-all cursor-pointer"
          >
            {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button 
            className="flex items-center gap-1.5 text-[10px] text-white px-2.5 py-1.5 rounded-lg bg-[#1f6feb] hover:bg-[#388bfd] font-mono font-semibold transition-all cursor-pointer"
          >
            <Play size={12} fill="white" />
            <span>Run</span>
          </button>
        </div>
      </div>

      {/* SQL Code Block */}
      <div className="relative">
        <pre className="font-mono text-[11px] text-[#e6edf3] leading-relaxed overflow-x-auto p-4 bg-[#161b22] rounded-lg border border-[#30363d] select-all">
          <code>{query}</code>
        </pre>
      </div>

      {/* Results Table Section */}
      <div className="mt-5 pt-5 border-t border-[#30363d]">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-mono text-[#8b949e] uppercase tracking-wider font-bold">
            Execution Result · {results.length} rows
          </p>
          <button 
            className="flex items-center gap-1 text-[10px] text-[#c9d1d9] hover:text-white transition-colors cursor-pointer"
          >
            <Download size={11} />
            <span className="font-mono">Export CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#30363d]">
          <table className="w-full text-xs font-mono border-collapse">
            <thead>
              <tr className="text-[#8b949e] border-b border-[#30363d] bg-[#161b22]/50">
                {['quarter', 'revenue', 'op_expense', 'net_profit', 'margin_pct'].map((h) => (
                  <th key={h} className="text-left py-2.5 px-4 font-semibold select-none">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[#c9d1d9] divide-y divide-[#21262d]">
              {results.map((r) => (
                <tr key={r.quarter} className="hover:bg-[#161b22] transition-colors">
                  <td className="py-2.5 px-4 text-[#58a6ff] font-semibold">{r.quarter}</td>
                  <td className="py-2.5 px-4">{r.revenue}M</td>
                  <td className="py-2.5 px-4">{r.expenses}M</td>
                  <td className={`py-2.5 px-4 font-semibold ${r.profit < 5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    ${r.profit}M
                  </td>
                  <td className={`py-2.5 px-4 font-semibold ${r.margin < 20 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {r.margin}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
